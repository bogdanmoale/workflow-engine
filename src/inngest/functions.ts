import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const openAi = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const anthropicAi = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const executeAi = inngest.createFunction(
  { id: "execute-ai", triggers: { event: "execute/ai" } },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant",
        prompt: "What is 2+2?",
      },
    );

    const { steps: openAiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openAi("gpt-4"),
        system: "You are a helpful assistant",
        prompt: "What is 2+2?",
      },
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropicAi("claude-3-5-sonnet"),
        system: "You are a helpful assistant",
        prompt: "What is 2+2?",
      },
    );

    return {
      geminiSteps,
      openAiSteps,
      anthropicSteps,
    };
  },
);
