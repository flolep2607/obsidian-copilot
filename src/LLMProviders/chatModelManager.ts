import { CustomModel, LangChainParams, ModelConfig } from "@/aiParams";
import { BUILTIN_CHAT_MODELS, ChatModelProviders } from "@/constants";
import EncryptionService from "@/encryptionService";
import { GithubCOPILOT } from "@/langchainWrappers";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { Notice } from "obsidian";

export default class ChatModelManager {
  private encryptionService: EncryptionService;
  private static instance: ChatModelManager;
  private static chatModel: BaseChatModel;
  private static chatOpenAI: ChatOpenAI;
  private static modelMap: Record<
    string,
    {
      hasApiKey: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AIConstructor: new (config: any) => BaseChatModel;
      vendor: string;
    }
  >;

  private constructor(
    private getLangChainParams: () => LangChainParams,
    encryptionService: EncryptionService,
    activeModels: CustomModel[]
  ) {
    this.encryptionService = encryptionService;
    this.buildModelMap(activeModels);
  }

  static getInstance(
    getLangChainParams: () => LangChainParams,
    encryptionService: EncryptionService,
    activeModels: CustomModel[]
  ): ChatModelManager {
    if (!ChatModelManager.instance) {
      ChatModelManager.instance = new ChatModelManager(
        getLangChainParams,
        encryptionService,
        activeModels
      );
    }
    return ChatModelManager.instance;
  }

  private getModelConfig(customModel: CustomModel): ModelConfig {
    const decrypt = (key: string) => this.encryptionService.getDecryptedKey(key);
    const params = this.getLangChainParams();
    const baseConfig: ModelConfig = {
      modelName: customModel.name,
      temperature: params.temperature,
      streaming: true,
      maxRetries: 3,
      maxConcurrency: 3,
      enableCors: customModel.enableCors,
    };

    const providerConfig = {
      [ChatModelProviders.GOOGLE]: {
        apiKey: decrypt(customModel.apiKey || params.googleApiKey),
        modelName: customModel.name,
      },
      [ChatModelProviders.COPILOT]: {
        modelName: customModel.name,
        openAIApiKey: decrypt(params.openAIApiKey || "default-key"),
        maxTokens: params.maxTokens,
      },
    };

    const selectedProviderConfig =
      providerConfig[customModel.provider as keyof typeof providerConfig] || {};

    return { ...baseConfig, ...selectedProviderConfig };
  }

  // Build a map of modelKey to model config
  public buildModelMap(activeModels: CustomModel[]) {
    ChatModelManager.modelMap = {};
    const modelMap = ChatModelManager.modelMap;

    const allModels = activeModels ?? BUILTIN_CHAT_MODELS;

    allModels.forEach((model) => {
      if (model.enabled) {
        let constructor;
        let apiKey;

        switch (model.provider) {
          case ChatModelProviders.GOOGLE:
            constructor = ChatGoogleGenerativeAI;
            apiKey = model.apiKey || this.getLangChainParams().googleApiKey;
            break;
          case ChatModelProviders.COPILOT:
            constructor = GithubCOPILOT;
            apiKey = model.apiKey || "default-key";
            break;
          default:
            console.warn(`Unknown provider: ${model.provider} for model: ${model.name}`);
            return;
        }

        const modelKey = `${model.name}|${model.provider}`;
        modelMap[modelKey] = {
          hasApiKey: Boolean(model.apiKey || apiKey),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          AIConstructor: constructor as any,
          vendor: model.provider,
        };
      }
    });
  }

  getChatModel(): BaseChatModel {
    return ChatModelManager.chatModel;
  }

  setChatModel(model: CustomModel): void {
    const modelKey = `${model.name}|${model.provider}`;
    if (!ChatModelManager.modelMap.hasOwnProperty(modelKey)) {
      throw new Error(`No model found for: ${modelKey}`);
    }

    // Create and return the appropriate model
    const selectedModel = ChatModelManager.modelMap[modelKey];
    if (!selectedModel.hasApiKey) {
      const errorMessage = `API key is not provided for the model: ${modelKey}. Model switch failed.`;
      new Notice(errorMessage);
      // Stop execution and deliberate fail the model switch
      throw new Error(errorMessage);
    }

    const modelConfig = this.getModelConfig(model);

    // MUST update it since chatModelManager is a singleton.
    this.getLangChainParams().modelKey = `${model.name}|${model.provider}`;
    new Notice(`Setting model: ${modelConfig.modelName}`);
    try {
      const newModelInstance = new selectedModel.AIConstructor({
        ...modelConfig,
      });
      // Set the new model
      ChatModelManager.chatModel = newModelInstance;
    } catch (error) {
      console.error(error);
      new Notice(`Error creating model: ${modelKey}`);
    }
  }

  validateChatModel(chatModel: BaseChatModel): boolean {
    if (chatModel === undefined || chatModel === null) {
      return false;
    }
    return true;
  }

  async countTokens(inputStr: string): Promise<number> {
    return ChatModelManager.chatModel.getNumTokens(inputStr);
  }
}
