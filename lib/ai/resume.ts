import { tool } from 'ai';
import { z } from 'zod';

export const getResume = tool({
  description: 'Get the current weather in New York City',
  parameters: z.object({}),
  execute: async () => {
    return {
        resumeLink: process.env.NEXT_PUBLIC_RESUME_LINK,
        downloadLink: process.env.NEXT_PUBLIC_RESUME_DOWNLOAD_LINK,
    }
  },
});