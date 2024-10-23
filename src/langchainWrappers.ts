/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnthropicInput, ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { requestUrl } from "obsidian";
import OpenAI from "openai";

// Migrated to OpenAI v4 client from v3: https://github.com/openai/openai-node/discussions/217

const token_url = "https://api.github.com/copilot_internal/v2/token";

export class GithubCOPILOT extends ChatOpenAI {
  constructor(fields?: any) {
    super(fields ?? {});

    const GITHUB_TOKEN = this["clientConfig"].apiKey;
    const headers = {
      authorization: `token ${GITHUB_TOKEN}`,
      "editor-version": "Neovim/0.6.1",
      "editor-plugin-version": "copilot.vim/1.16.0",
      "user-agent": "GithubCopilot/1.155.0",
    };
    let pointer = this["client"];
    function update_key() {
      return requestUrl({ url: token_url, headers })
        .then((response) => {
          const data = response.json;
          if (pointer) {
            pointer.apiKey = data.token;
          }
          console.log("TOKEN Expire in:", (data.expires_at * 1000 - Date.now()) / 1000, "seconds");
          setTimeout(update_key, data.expires_at * 1000 - Date.now() - 10_000); // 10 seconds before expiry
          return data.token;
        })
        .catch((error) => console.error("Error:", error));
    }

    update_key().then((apiKey) => {
      this["client"] = new OpenAI({
        ...this["clientConfig"],
        apiKey,
        dangerouslyAllowBrowser: true,
        fetch: safe(safeFetch, update_key),
        // modelName: "gpt-3.5-turbo",
        defaultHeaders: {
          "Editor-Version": "vscode/1.91.1",
        },
      });
      pointer = this["client"];
    });
  }
}

export class GithubCOPILOTEmbeddings extends OpenAIEmbeddings {
  constructor(fields?: any) {
    super(fields ?? {});

    const GITHUB_TOKEN = this["clientConfig"].apiKey;
    const headers = {
      authorization: `token ${GITHUB_TOKEN}`,
      "editor-version": "Neovim/0.6.1",
      "editor-plugin-version": "copilot.vim/1.16.0",
      "user-agent": "GithubCopilot/1.155.0",
    };
    let pointer = this["client"];
    function update_key() {
      return requestUrl({ url: token_url, headers })
        .then((response) => {
          const data = response.json;
          if (pointer) {
            pointer.apiKey = data.token;
          }
          console.log(
            "Embeddings TOKEN Expire in:",
            (data.expires_at * 1000 - Date.now()) / 1000,
            "seconds"
          );
          setTimeout(update_key, data.expires_at * 1000 - Date.now() - 10_000); // 10 seconds before expiry
          return data.token;
        })
        .catch((error) => console.error("Error:", error));
    }

    update_key().then((apiKey) => {
      this["client"] = new OpenAI({
        ...this["clientConfig"],
        apiKey,
        dangerouslyAllowBrowser: true,
        fetch: safe(safeFetch, update_key),
        // modelName: "gpt-3.5-turbo",
        defaultHeaders: {
          "Editor-Version": "vscode/1.91.1",
        },
      });
      pointer = this["client"];
    });
  }
}

export class ChatAnthropicWrapped extends ChatAnthropic {
  constructor(fields?: Partial<AnthropicInput>) {
    super({
      ...fields,
      // Required to bypass CORS restrictions
      clientOptions: { defaultHeaders: { "anthropic-dangerous-direct-browser-access": "true" } },
    });
  }
}

function safe(fetch: typeof window.fetch, update_key: () => Promise<string>) {
  return async (url: string, options: RequestInit) => {
    if (url === token_url) {
      return fetch(url, options);
    }
    const response = await fetch(url, options);
    if (response.status === 401) {
      console.log("Token expired, updating...");
      await update_key();
      return fetch(url, options);
    }
    return response;
  };
}

/** Proxy function to use in place of fetch() to bypass CORS restrictions.
 * It currently doesn't support streaming until this is implemented
 * https://forum.obsidian.md/t/support-streaming-the-request-and-requesturl-response-body/87381 */
async function safeFetch(url: string, options: RequestInit): Promise<Response> {
  // Necessary to remove 'content-length' in order to make headers compatible with requestUrl()
  delete (options.headers as Record<string, string>)["content-length"];

  if (typeof options.body === "string") {
    const newBody = JSON.parse(options.body ?? {});
    // frequency_penalty: default 0, but perplexity.ai requires 1 by default.
    // so, delete this argument for now
    delete newBody["frequency_penalty"];
    if (url.endsWith("/embeddings") && typeof newBody.input === "string") {
      newBody.input = [newBody.input];
    }
    options.body = JSON.stringify(newBody);
  }

  console.log("safeFetch", url, options);
  let response: any;
  try {
    response = await requestUrl({
      url,
      contentType: "application/json",
      headers: options.headers as Record<string, string>,
      method: "POST",
      body: options.body?.toString(),
    });
  } catch (e) {
    console.error("safeFetch error", url, e);
    throw e;
  }

  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    statusText: response.status.toString(),
    headers: new Headers(response.headers),
    url: url,
    type: "basic",
    redirected: false,
    body: createReadableStreamFromString(response.text),
    bodyUsed: true,
    json: () => response.json,
    text: async () => response.text,
    bytes: async () => {
      const text = await response.text;
      const encoder = new TextEncoder();
      return encoder.encode(text);
    },
    clone: () => {
      throw new Error("not implemented");
    },
    arrayBuffer: () => {
      throw new Error("not implemented");
    },
    blob: () => {
      throw new Error("not implemented");
    },
    formData: () => {
      throw new Error("not implemented");
    },
  };
}

function createReadableStreamFromString(input: string) {
  return new ReadableStream({
    start(controller) {
      // Convert the input string to a Uint8Array
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(input);

      // Push the data to the stream
      controller.enqueue(uint8Array);

      // Close the stream
      controller.close();
    },
  });
}
