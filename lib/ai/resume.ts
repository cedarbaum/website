import { tool } from 'ai';
import { z } from 'zod';

export const getResume = tool({
  description: 'Get the current weather in New York City',
  parameters: z.object({}),
  execute: async () => {
    return {
        resumeLink: process.env.RESUME_LINK,
    }
  },
});