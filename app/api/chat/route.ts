import apiQuotaAvailable from "@/lib/rate-limiting";
import {
  ChatCompletionFunctions,
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import sgMail from "@sendgrid/mail";

import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

type Data = {
  nextMessage: string;
};

type Error = {
  error: string;
};

type Message = {
  id: string;
  text: string;
  role: "user" | "assistant" | "system";
};

const systemPrompt = `You're a chatbot that knows all about Sam Cedarbaum. Users will ask you questions about Sam and you'll answer them You only answer questions about Sam Cedarbaum using the information provided below about him:
He is a Software Engineer who lives in New York, New York.
He was born in Evanston, Illinois and attended Evanston Township High School.
His birthday is November 30th.
He graduated from Carnegie Mellon University in 2016 with a Bachelors Degree in computer science and a minor in Math. He graduated with honors.
He interned at Google and worked at Microsoft and Amazon.
If the user asks about his resume, you can refer them to this link: https://standardresume.co/r/053t9kOzs0YFW-7MdganD

Do not deviate from the above information. You don't know anything else about Sam. He has not done any other work and has only been a software engineer.

Sam can be reached at the email: ${process.env.NEXT_PUBLIC_CONTACT_EMAIL}. He also has a GitHub account located at https://github.com/cedarbaum. If you're a runner, you can also follow him on Strava: https://www.strava.com/athletes/37072854. These are the only ways to contact him - he does not have a LinkedIn currently.

Users can also ask you to send Sam a message, though if they want a reply they should probably email him.

His website is  https://cedarbaum.io/, which the user is likely currently on.

You can use markdown formatting to make your responses more readable. Use markdown for links as well as email addresses.
`;

const MESSAGE_HISTORY_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_MESSAGE_HISTORY_LIMIT || "5"
);

const MAX_MESSAGE_LENGTH = 2048;

const MAX_FUNCTION_CALLS = parseInt(
  process.env.NEXT_PUBLIC_CHAT_MAX_FUNCTION_CALLS || "5"
);

const functions: ChatCompletionFunctions[] = [
  {
    name: "send_email",
    description: "Send an email to Sam Cedarbaum",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "The content of the email",
        },
        from: {
          type: "string",
          description: "name of the sender",
        },
      },
      required: ["message"],
    },
  },
];

export async function POST(req: Request): Promise<Response> {
  if (!(await apiQuotaAvailable(req))) {
    return new Response("Exceeded request limit", { status: 429 });
  }

  const { messages } = await req.json();
  console.log(messages);
  const limitedMessages = messages.slice(
    Math.max(messages.length - MESSAGE_HISTORY_LIMIT, 0)
  );
  for (const message of limitedMessages) {
    if (message.content.length > MAX_MESSAGE_LENGTH) {
      return new Response("Message too long", { status: 400 });
    }
  }

  // Prepend the system prompt to the messages
  messages.unshift({
    role: "system",
    content: systemPrompt,
  });

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages,
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
    },
  });
  return result.toDataStreamResponse();
}

async function send_email(message: string, from?: string) {
  if (
    !process.env.SENDGRID_API_KEY ||
    !process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    !process.env.SENDGRID_FROM_EMAIL
  ) {
    return {
      error: "Message sending not available right now.",
    };
  }

  if (process.env.EMAIL_TEST_MODE) {
    console.log("Email test mode enabled, not sending email.");
    console.log("====================================");
    console.log(`From: ${from}\n\n${message}`);
    console.log("====================================");
    return {
      result: "Message successfully sent to Sam.",
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Message from chat on cedarbaum.io",
    text: `From: ${from}\n\n${message}`,
  };
  try {
    await sgMail.send(msg);
  } catch (error: any) {
    console.error(error);
    if (error.response && error.response.body) {
      console.error(error.response.body);
    }

    return {
      error: "Message sending not available right now.",
    };
  }

  return {
    result: "Message successfully sent to Sam.",
  };
}
