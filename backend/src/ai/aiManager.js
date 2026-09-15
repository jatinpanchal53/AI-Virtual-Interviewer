import { GeminiAIProvider } from './geminiProvider.js';
import { MockAIProvider } from './mockProvider.js';

let activeProvider = null;

export function getAIProvider() {
  if (!activeProvider) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      console.log('🤖 AI Virtual Interviewer: Initializing Gemini AI Provider');
      activeProvider = new GeminiAIProvider(apiKey);
    } else {
      console.log('💡 AI Virtual Interviewer: Initializing Intelligent Mock / Offline Provider');
      activeProvider = new MockAIProvider();
    }
  }
  return activeProvider;
}

export function setAIProvider(customProvider) {
  activeProvider = customProvider;
}
