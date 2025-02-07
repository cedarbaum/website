import { useRef } from "react";
import { useChat } from "ai/react";
import { Message, UIMessage } from "@ai-sdk/ui-utils";
import { MemoizedMarkdown } from "./memoized-markdown";
import { Messages } from "./messages";
import { Input } from "./input";
import { toast, useToast } from "@/hooks/use-toast";
import Glow from "./glow";

export enum ContextType {
  Generic,
  SingleUrl,
  Contact,
}

export type Context = {
  type: ContextType;
  data: string | null;
};

const MESSAGE_HISTORY_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_MESSAGE_HISTORY_LIMIT || "5"
);

const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: `Hey there! Welcome to Sam's website! You can ask me all sorts of questions about Sam, such as:\n
1. Tell me about Sam
2. How can I contact Sam?
3.  Does he have a resume or just this weird chatbot?`,
  },
];

export default function Chat({
  onContextChange,
}: {
  onContextChange: (ctx: Context) => void;
}) {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const commonChips = [
    { label: "📝 Resume", message: "Resume" },
    { label: "📧 Contact", message: "Contact" },
  ];

  const { toast } = useToast();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    isLoading,
    stop,
  } = useChat({
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    onError: (error) => {
      toast({
        title: "An error occured, please try again!",
        description: error.message,
      });
    },
  });

  return (
    <div className="overflow-visible relative justify-center items-center flex flex-col h-full">
      <div className="relative flex flex-col w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-lg overflow-hidden bg-white dark:bg-black dark:text-white">
        <Messages
          isLoading={isLoading}
          messages={messages}
          setMessages={setMessages}
        />
        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <Input
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            setMessages={setMessages}
          />
        </form>
      </div>
      <Glow className="absolute top-0 left-0 w-full h-full" />
    </div >
  )
}

function MessageBubble({ message, isTyping, isError }: { message: UIMessage, isTyping?: boolean, isError?: boolean }) {
  let bubbleClass = "ml-auto bg-blue-500 text-white";
  if (isError) {
    bubbleClass = "bg-red-500 text-white";
  } else if (message.role === "assistant" || message.role === "system") {
    bubbleClass = "mr-auto bg-gray-200";
  }

  return (
    <div className={`prose p-3 mb-2 rounded-lg max-w-sm w-fit ${bubbleClass}`}>
      <MemoizedMarkdown id={message.id} content={message.content} />
    </div>
  );
}