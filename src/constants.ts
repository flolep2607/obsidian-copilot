import { CustomModel } from "@/aiParams";
import { CopilotSettings } from "@/settings/SettingsPage";
import { ChainType } from "./chainFactory";

export const CHAT_VIEWTYPE = "copilot-chat-view";
export const USER_SENDER = "user";
export const AI_SENDER = "ai";
export const DEFAULT_SYSTEM_PROMPT =
  "You are Obsidian Copilot, a helpful assistant that integrates AI to Obsidian note-taking.";
export const CHUNK_SIZE = 5000;

export enum ChatModels {
  GPT_4o = "gpt-4o",
  GPT_4o_mini = "gpt-4o-mini",
  GPT_4_TURBO = "gpt-4-turbo",
  GEMINI_PRO = "gemini-1.5-pro",
  GEMINI_FLASH = "gemini-1.5-flash",
}

// Model Providers
export enum ChatModelProviders {
  GOOGLE = "google",
  COPILOT = "github copilot",
}

export const BUILTIN_CHAT_MODELS: CustomModel[] = [
  {
    name: "gpt-4o",
    provider: ChatModelProviders.COPILOT,
    enabled: true,
    isBuiltIn: true,
    core: true,
  },
  {
    name: "gpt-4o-mini",
    provider: ChatModelProviders.COPILOT,
    enabled: true,
    isBuiltIn: true,
    core: true,
  },
  {
    name: "gpt-4-0125-preview",
    provider: ChatModelProviders.COPILOT,
    enabled: true,
    isBuiltIn: true,
    core: true,
  },
  {
    name: "gpt-4",
    provider: ChatModelProviders.COPILOT,
    enabled: true,
    isBuiltIn: true,
    core: true,
  },
  {
    name: "gpt-3.5-turbo",
    provider: ChatModelProviders.COPILOT,
    enabled: true,
    isBuiltIn: true,
    core: true,
  },
  {
    name: ChatModels.GEMINI_PRO,
    provider: ChatModelProviders.GOOGLE,
    enabled: true,
    isBuiltIn: true,
  },
  {
    name: ChatModels.GEMINI_FLASH,
    provider: ChatModelProviders.GOOGLE,
    enabled: true,
    isBuiltIn: true,
  },
];

export enum EmbeddingModelProviders {
  COPILOT = "github copilot",
}

export enum EmbeddingModels {
  OPENAI_EMBEDDING_ADA_V2 = "text-embedding-ada-002",
  OPENAI_EMBEDDING_SMALL = "text-embedding-3-small",
  OPENAI_EMBEDDING_SMALL_INF = "text-embedding-3-small-inference",
}

export const BUILTIN_EMBEDDING_MODELS: CustomModel[] = [
  {
    name: EmbeddingModels.OPENAI_EMBEDDING_SMALL,
    provider: EmbeddingModelProviders.COPILOT,
    enabled: true,
    isBuiltIn: true,
    isEmbeddingModel: true,
    core: true,
  },
];

// Embedding Models
export const NOMIC_EMBED_TEXT = "nomic-embed-text";
// export const DISTILBERT_NLI = 'sentence-transformers/distilbert-base-nli-mean-tokens';
// export const INSTRUCTOR_XL = 'hkunlp/instructor-xl'; // Inference API is off for this
// export const MPNET_V2 = 'sentence-transformers/all-mpnet-base-v2'; // Inference API returns 400

export enum VAULT_VECTOR_STORE_STRATEGY {
  NEVER = "NEVER",
  ON_STARTUP = "ON STARTUP",
  ON_MODE_SWITCH = "ON MODE SWITCH",
}

export const VAULT_VECTOR_STORE_STRATEGIES = [
  VAULT_VECTOR_STORE_STRATEGY.NEVER,
  VAULT_VECTOR_STORE_STRATEGY.ON_STARTUP,
  VAULT_VECTOR_STORE_STRATEGY.ON_MODE_SWITCH,
];

export const COMMAND_IDS = {
  FIX_GRAMMAR: "fix-grammar-prompt",
  SUMMARIZE: "summarize-prompt",
  GENERATE_TOC: "generate-toc-prompt",
  GENERATE_GLOSSARY: "generate-glossary-prompt",
  SIMPLIFY: "simplify-prompt",
  EMOJIFY: "emojify-prompt",
  REMOVE_URLS: "remove-urls-prompt",
  REWRITE_TWEET: "rewrite-tweet-prompt",
  REWRITE_TWEET_THREAD: "rewrite-tweet-thread-prompt",
  MAKE_SHORTER: "make-shorter-prompt",
  MAKE_LONGER: "make-longer-prompt",
  ELI5: "eli5-prompt",
  PRESS_RELEASE: "press-release-prompt",
  TRANSLATE: "translate-selection-prompt",
  CHANGE_TONE: "change-tone-prompt",
  COUNT_TOKENS: "count-tokens",
  COUNT_TOTAL_VAULT_TOKENS: "count-total-vault-tokens",
};

export const DEFAULT_SETTINGS: CopilotSettings = {
  openAIApiKey: "",
  openAIOrgId: "",
  huggingfaceApiKey: "",
  cohereApiKey: "",
  anthropicApiKey: "",
  azureOpenAIApiKey: "",
  azureOpenAIApiInstanceName: "",
  azureOpenAIApiDeploymentName: "",
  azureOpenAIApiVersion: "",
  azureOpenAIApiEmbeddingDeploymentName: "",
  googleApiKey: "",
  openRouterAiApiKey: "",
  defaultChainType: ChainType.LLM_CHAIN,
  defaultModelKey: ChatModels.GPT_4o + "|" + ChatModelProviders.COPILOT,
  embeddingModelKey: EmbeddingModels.OPENAI_EMBEDDING_SMALL + "|" + ChatModelProviders.COPILOT,
  temperature: 0.1,
  maxTokens: 1000,
  contextTurns: 15,
  userSystemPrompt: "",
  openAIProxyBaseUrl: "",
  openAIEmbeddingProxyBaseUrl: "",
  stream: true,
  defaultSaveFolder: "copilot-conversations",
  defaultConversationTag: "copilot-conversation",
  autosaveChat: true,
  customPromptsFolder: "copilot-custom-prompts",
  indexVaultToVectorStore: VAULT_VECTOR_STORE_STRATEGY.ON_MODE_SWITCH,
  qaExclusions: "",
  chatNoteContextPath: "",
  chatNoteContextTags: [],
  debug: false,
  enableEncryption: false,
  maxSourceChunks: 3,
  groqApiKey: "",
  activeModels: BUILTIN_CHAT_MODELS,
  activeEmbeddingModels: BUILTIN_EMBEDDING_MODELS,
  embeddingRequestsPerSecond: 10,
  enabledCommands: {
    [COMMAND_IDS.FIX_GRAMMAR]: {
      enabled: true,
      name: "Fix grammar and spelling of selection",
    },
    [COMMAND_IDS.SUMMARIZE]: {
      enabled: true,
      name: "Summarize selection",
    },
    [COMMAND_IDS.GENERATE_TOC]: {
      enabled: true,
      name: "Generate table of contents for selection",
    },
    [COMMAND_IDS.GENERATE_GLOSSARY]: {
      enabled: true,
      name: "Generate glossary for selection",
    },
    [COMMAND_IDS.SIMPLIFY]: {
      enabled: true,
      name: "Simplify selection",
    },
    [COMMAND_IDS.EMOJIFY]: {
      enabled: true,
      name: "Emojify selection",
    },
    [COMMAND_IDS.REMOVE_URLS]: {
      enabled: true,
      name: "Remove URLs from selection",
    },
    [COMMAND_IDS.REWRITE_TWEET]: {
      enabled: true,
      name: "Rewrite selection to a tweet",
    },
    [COMMAND_IDS.REWRITE_TWEET_THREAD]: {
      enabled: true,
      name: "Rewrite selection to a tweet thread",
    },
    [COMMAND_IDS.MAKE_SHORTER]: {
      enabled: true,
      name: "Make selection shorter",
    },
    [COMMAND_IDS.MAKE_LONGER]: {
      enabled: true,
      name: "Make selection longer",
    },
    [COMMAND_IDS.ELI5]: {
      enabled: true,
      name: "Explain selection like I'm 5",
    },
    [COMMAND_IDS.PRESS_RELEASE]: {
      enabled: true,
      name: "Rewrite selection to a press release",
    },
    [COMMAND_IDS.TRANSLATE]: {
      enabled: true,
      name: "Translate selection",
    },
    [COMMAND_IDS.CHANGE_TONE]: {
      enabled: true,
      name: "Change tone of selection",
    },
  },
  promptUsageTimestamps: {},
};

export const EVENT_NAMES = {
  CHAT_IS_VISIBLE: "chat-is-visible",
};

export enum ABORT_REASON {
  USER_STOPPED = "user-stopped",
  NEW_CHAT = "new-chat",
}
