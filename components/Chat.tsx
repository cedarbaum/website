import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingDots from "../components/LoadingDots";
import { Chip, Message } from "./Message";
import getCannedResponse from "./CannedResponses";

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

function processAssistantText(text: string, id: number): [Message, Context] {
  let focusUrl = undefined;
  let urlCount = 0;
  let hasContactInfo = false;
  function urlify(text: string) {
    // HACK: ensure URL doesn't end with common punctuation
    const urlRegex = /(https?:\/\/[^\s]+[^\.,;:\s\)\(])/g;
    const textWithUrlsReplaced = text.replace(urlRegex, function (url) {
      urlCount++;
      focusUrl = url;
      return (
        '<a target="_blank" class="underline" href="' +
        url +
        '">' +
        url +
        "</a>"
      );
    });

    const emailRegex = /(scedarbaum@gmail.com)/g;
    return textWithUrlsReplaced.replace(emailRegex, function (email) {
      hasContactInfo = true;
      return (
        '<a target="_" class="underline" href="mailto:' +
        email +
        '">' +
        email +
        "</a>"
      );
    });
  }

  const htmlOrText = urlify(text);
  const type = htmlOrText === text ? "text" : "html";
  const message = {
    id,
    text: text,
    html: type === "html" ? htmlOrText : undefined,
    role: "assistant",
    type,
  } as Message;

  let contextType = ContextType.Generic;
  if (hasContactInfo) {
    contextType = ContextType.Contact;
  } else if (urlCount === 1 && focusUrl) {
    contextType = ContextType.SingleUrl;
  }

  return [message, { type: contextType, data: focusUrl ?? null }];
}

export default function Chat({
  onContextChange,
}: {
  onContextChange: (ctx: Context) => void;
}) {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const commonChips = [
    { label: "📝 Resume", message: "Resume" },
    { label: "📧 Contact", message: "Contact" },
    { label: "🚧 Projects", message: "Projects" },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hey there! Welcome to Sam's website! You can ask me all sorts of questions about Sam, such as:\n
1. Tell me about Sam
2. How can I contact Sam?
3  Does he have a resume or just this weird chatbot?`,
      role: "system",
      chips: commonChips,
    },
  ]);

  const handleAssistantResponse = (response: string, id: number) => {
    const [message, context] = processAssistantText(response, id);
    setMessages((messages) => [...messages, message]);
    onContextChange(context);
  };

  const { isFetching, refetch, error } = useQuery(
    ["messages", messages.length],
    async () => {
      const validMessages = messages.filter(
        (m) => m.role !== "system" && m.type !== "error"
      );
      const limitedMessages = validMessages.slice(
        Math.max(validMessages.length - MESSAGE_HISTORY_LIMIT, 0)
      );

      const lastUserMessage = limitedMessages[limitedMessages.length - 1];
      const cannedResponse = getCannedResponse(lastUserMessage?.text);
      if (cannedResponse) {
        await delay(1000);
        handleAssistantResponse(cannedResponse, messages.length + 1);
        return cannedResponse;
      }

      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          messages: limitedMessages,
        }),
      });

      if (!res.ok) {
        const errorMessage =
          res.status === 429
            ? "Too many requests sent, please wait a few moments."
            : "Something went wrong. Please try again.";
        setMessages((messages) => [
          ...messages,
          {
            role: "system",
            id: messages.length + 1,
            isTyping: false,
            text: `${errorMessage} You can still select below prompts for common information:`,
            type: "error",
            chips: commonChips,
          },
        ]);

        throw new Error("Failed to fetch message");
      }

      const resJson = await res.json();

      const nextMessage = resJson.nextMessage as string;
      handleAssistantResponse(nextMessage, messages.length + 1);

      return nextMessage;
    },
    {
      enabled: false,
    }
  );

  const handleSendMessage = (text: string) => {
    if (isFetching || text.trim().length === 0) {
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      text,
      role: "user",
    };
    setMessages([...messages, newMessage]);
  };

  useEffect(() => {
    if (messages[messages.length - 1].role === "user") {
      refetch();
    }
  }, [messages, refetch]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, isFetching]);

  const renderMessages = () => {
    let allMessages = messages;
    if (isFetching) {
      allMessages = [
        ...allMessages,
        {
          role: "assistant",
          id: messages.length + 1,
          isTyping: true,
          text: undefined,
        },
      ];
    } else if (error) {
      allMessages = [
        ...allMessages,
        {
          role: "system",
          id: messages.length + 1,
          isTyping: false,
          text: "Something went wrong. Please try again.",
          type: "error",
        },
      ];
    }

    return allMessages.map((message) => (
      <div key={message.id}>
        <div className="px-4">
          <MessageBubble message={message} />
        </div>
        {message.chips && (
          <div className="pl-4">
            <Chips
              chips={message.chips}
              onClick={(chip) => {
                if (isFetching) {
                  return;
                }

                setMessages((messages) => [
                  ...messages,
                  {
                    role: "user",
                    id: messages.length + 1,
                    isTyping: false,
                    text: chip.message,
                    type: "text",
                  },
                ]);
              }}
            />
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-gray-100 flex flex-col h-full border border-gray-300">
      <div
        ref={messageContainerRef}
        className="overflow-scroll h-full flex-grow scrollbar-hide"
      >
        <div className="pt-4">{renderMessages()}</div>
      </div>
      <div className="bg-gray-100 p-4 flex items-center">
        <input
          id="message-input"
          type="text"
          placeholder="Type a message..."
          className="w-full bg-white border border-gray-300 rounded-full py-2 px-4 mr-2"
          onKeyPress={(event: any) => {
            if (event.key === "Enter") {
              handleSendMessage(event.target.value);
              event.target.value = "";
            }
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => {
            const input = document.querySelector(
              "#message-input"
            ) as HTMLInputElement;
            handleSendMessage(input.value);
            input.value = "";
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  let innerHtml;
  if (message.isTyping) {
    innerHtml = (
      <div className="flex items-center">
        <LoadingDots style="large" color="black" />
      </div>
    );
  } else if (message.type === "html") {
    innerHtml = (
      <span
        className="inline-block whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: message.html! }}
      />
    );
  } else {
    innerHtml = (
      <span className="inline-block whitespace-pre-wrap">{message.text}</span>
    );
  }

  let bubbleClass = "ml-auto bg-blue-500 text-white";
  if (message.type === "error") {
    bubbleClass = "bg-red-500 text-white";
  } else if (message.role === "assistant" || message.role === "system") {
    bubbleClass = "mr-auto bg-gray-200";
  }

  return (
    <div className={`p-3 mb-2 rounded-lg max-w-sm w-fit ${bubbleClass}`}>
      {innerHtml}
    </div>
  );
}

function Chips({
  chips,
  onClick,
}: {
  chips: Chip[];
  onClick: (chip: Chip) => void;
}) {
  return (
    <div
      className={`w-full scrollbar-hide overflow-scroll pt-2 mb-2 rounded-lg max-w-sm w-fit flex`}
    >
      {chips.map((chip) => {
        return (
          <div
            key={chip.label}
            className="whitespace-nowrap rounded-full mr-2 bg-gray-300 py-2 px-4 hover:bg-gray-400 cursor-pointer"
            onClick={() => onClick(chip)}
          >
            {chip.label}
          </div>
        );
      })}
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
