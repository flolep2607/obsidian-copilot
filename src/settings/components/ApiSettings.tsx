import React from "react";
import ApiSetting from "./ApiSetting";
import Collapsible from "./Collapsible";

interface ApiSettingsProps {
  openAIApiKey: string;
  setOpenAIApiKey: (value: string) => void;
  openAIOrgId: string;
  setOpenAIOrgId: (value: string) => void;
  googleApiKey: string;
  setGoogleApiKey: (value: string) => void;
  anthropicApiKey: string;
  setAnthropicApiKey: (value: string) => void;
  openRouterAiApiKey: string;
  setOpenRouterAiApiKey: (value: string) => void;
  azureOpenAIApiKey: string;
  setAzureOpenAIApiKey: (value: string) => void;
  azureOpenAIApiInstanceName: string;
  setAzureOpenAIApiInstanceName: (value: string) => void;
  azureOpenAIApiDeploymentName: string;
  setAzureOpenAIApiDeploymentName: (value: string) => void;
  azureOpenAIApiVersion: string;
  setAzureOpenAIApiVersion: (value: string) => void;
  azureOpenAIApiEmbeddingDeploymentName: string;
  setAzureOpenAIApiEmbeddingDeploymentName: (value: string) => void;
  groqApiKey: string;
  setGroqApiKey: (value: string) => void;
  cohereApiKey: string;
  setCohereApiKey: (value: string) => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({
  openAIApiKey,
  setOpenAIApiKey,
  openAIOrgId,
  setOpenAIOrgId,
  googleApiKey,
  setGoogleApiKey,
  anthropicApiKey,
  setAnthropicApiKey,
  openRouterAiApiKey,
  setOpenRouterAiApiKey,
  azureOpenAIApiKey,
  setAzureOpenAIApiKey,
  azureOpenAIApiInstanceName,
  setAzureOpenAIApiInstanceName,
  azureOpenAIApiDeploymentName,
  setAzureOpenAIApiDeploymentName,
  azureOpenAIApiVersion,
  setAzureOpenAIApiVersion,
  azureOpenAIApiEmbeddingDeploymentName,
  setAzureOpenAIApiEmbeddingDeploymentName,
  groqApiKey,
  setGroqApiKey,
  cohereApiKey,
  setCohereApiKey,
}) => {
  return (
    <div>
      <br />
      <br />
      <h1>API Settings</h1>
      <p>All your API keys are stored locally.</p>
      <div className="warning-message">
        Make sure you have access to the model and the correct API key.
        <br />
        If errors occur, please re-enter the API key, save and reload the plugin to see if it
        resolves the issue.
      </div>
      <div>
        <div>
          <ApiSetting
            title="OpenAI API Key"
            value={openAIApiKey}
            setValue={setOpenAIApiKey}
            placeholder="Enter OpenAI API Key"
          />
          <p>
            You can find your API key at{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              TODO
            </a>
          </p>
        </div>
      </div>
      <br />
      <Collapsible title="Google API Settings">
        <div>
          <ApiSetting
            title="Google API Key"
            value={googleApiKey}
            setValue={setGoogleApiKey}
            placeholder="Enter Google API Key"
          />
          <p>
            If you have Google Cloud, you can get Gemini API key{" "}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
            <br />
            Your API key is stored locally and is only used to make requests to Google's services.
          </p>
        </div>
      </Collapsible>
    </div>
  );
};

export default ApiSettings;
