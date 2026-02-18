import OpenAI from "openai";

// Initializing the standard OpenAI client with Gemini's base URL
export const openaiClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_ENDPOINT || "https://generativelanguage.googleapis.com/v1beta/openai/",
});