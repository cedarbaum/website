import apiQuotaAvailable from "@/utils/RateLimiting";
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

const systemPrompt = {
  role: "system",
  content: `You're a chatbot that knows all about Sam Cedarbaum. Users will ask you questions about Sam and you'll answer them You only answer questions about Sam Cedarbaum using the information provided below about him:
He is a Software Engineer who lives in New York, New York.
He was born in Evanston, Illinois and attended Evanston Township High School.
His birthday is November 30th.
He graduated from Carnegie Mellon University in 2016 with a Bachelors Degree in computer science and a minor in Math. He graduated with honors.
He interned at Google and worked at Microsoft and Amazon.
If the user asks about his resume, you can refer them to this link: https://standardresume.co/r/053t9kOzs0YFW-7MdganD

Sam is working on a few projects:
- 🚇 https://closingdoors.nyc/ - a minimalist NYC subway, bus, and PATH schedule viewer
- 🏠 https://www.housecheck.nyc/ - search housing data in NYC
- 🏃 https://www.runstreak.app/ - a web app for tracking run streaks on Strava
- ☁️ https://www.postmodern.cloud/ - a postmodern take on weather forecasts
- 🥤 https://www.dietcoke.reviews/ - reviews of diet coke

Do not deviate from the above information. You don't know anything else about Sam. He has not done any other work and has only been a software engineer.

Sam can be reached at the email: scedarbaum@gmail.com. He also has a GitHub account located at https://github.com/cedarbaum. If you're a runner, you can also follow him on Strava: https://www.strava.com/athletes/37072854. These are the only ways to contact him - he does not have a LinkedIn currently.

His website is  https://cedarbaum.io/, which the user is likely currently on.
`,
};

const MESSAGE_HISTORY_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_MESSAGE_HISTORY_LIMIT || "5"
);

const MAX_MESSAGE_LENGTH = 2048;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (!(await apiQuotaAvailable(req))) {
    res.status(429).json({ error: "Exceeded request limit" });
    return;
  }

  const { messages } = JSON.parse(req.body) as {
    messages: Message[];
  };

  const validMessages = messages.filter(
    (m) => m.role === "assistant" || m.role === "user"
  );
  const limitedMessages = validMessages.slice(
    Math.max(validMessages.length - MESSAGE_HISTORY_LIMIT, 0)
  );

  for (const message of limitedMessages) {
    if (message.text.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ error: "Message too long" });
      return;
    }
  }

  const allMessages = [
    systemPrompt,
    ...limitedMessages.map((m) => ({
      role: m.role,
      content: m.text,
    })),
  ] as ChatCompletionRequestMessage[];

  try {
    const completion = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: allMessages,
      },
      { timeout: 10000 }
    );

    res
      .status(200)
      .json({ nextMessage: completion.data.choices[0].message!.content });
  } catch (e: any) {
    console.error(e?.message);
    throw e;
  }
}
