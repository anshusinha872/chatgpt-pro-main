import { Configuration, OpenAIApi } from 'openai';
export const checkApiKey = async (keys) => {
  const configuration = new Configuration({
    apiKey: keys,
  });

  const openai = new OpenAIApi(configuration);
  console.log('Checking API key...');
  console.log('Keys:', keys);
  console.log('openai:', openai);
  console.log('openai.listModels():', await openai.listModels());
  return openai.listModels();
};
