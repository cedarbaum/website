import apiQuotaAvailable from "@/lib/rate-limiting";

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getNycWeather } from "@/lib/ai/weather";
import { getResume } from "@/lib/ai/resume";
import { getContact } from "@/lib/ai/contact";
import { sendEmail } from "@/lib/ai/send-email";


const systemPrompt = `You're a chatbot that knows all about Sam Cedarbaum. Users will ask you questions about Sam and you'll answer them You only answer questions about Sam Cedarbaum using the information provided below about him:
He is a Software Engineer who lives in New York, New York.
He was born in Evanston, Illinois and attended Evanston Township High School.
His birthday is November 30th.
He graduated from Carnegie Mellon University in 2016 with a Bachelors Degree in computer science and a minor in Math. He graduated with honors.
He interned at Google and worked at Microsoft and Amazon.

Do not deviate from the above information. You don't know anything else about Sam. He has not done any other work and has only been a software engineer.

Users can also ask you to send Sam a message, though if they want a reply they should probably email him.

His website is  https://cedarbaum.io/, which the user is likely currently on.

You can use markdown formatting to make your responses more readable. Use markdown for links as well as email addresses.
`;

const MESSAGE_HISTORY_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_MESSAGE_HISTORY_LIMIT || "5"
);

const MAX_MESSAGE_LENGTH = 2048;

export async function POST(req: Request): Promise<Response> {
  if (!(await apiQuotaAvailable(req))) {
    return new Response("Exceeded request limit", { status: 429 });
  }

  const { messages } = await req.json();
  const limitedMessages = messages.slice(
    Math.max(messages.length - MESSAGE_HISTORY_LIMIT, 0)
  );
  for (const message of limitedMessages) {
    if (message.content.length > MAX_MESSAGE_LENGTH) {
      return new Response("Message too long", { status: 400 });
    }
  }

  // Prepend the system prompt to the messages
  limitedMessages.unshift({
    role: "system",
    content: systemPrompt,
  });

  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: limitedMessages,
    tools: {
      getNycWeather,
      getResume,
      getContact,
      sendEmail,
    },
  });
  return result.toDataStreamResponse();
}
