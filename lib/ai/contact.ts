import { tool } from "ai";
import { z } from "zod";

export const getContact = tool({
  description: 'Get the contact information for Sam Cedarbaum',
  parameters: z.object({}),
  execute: async () => {
    return {
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      github: process.env.NEXT_PUBLIC_GITHUB_LINK,
      location: process.env.NEXT_PUBLIC_LOCATION,
    };
  },
});
