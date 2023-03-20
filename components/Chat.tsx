import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingDots from "../components/LoadingDots";

const MESSAGE_HISTORY_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_MESSAGE_HISTORY_LIMIT || "5"
);

type Message = {
  id: number;
  text?: string;
  html?: string;
  role: "user" | "assistant" | "system";
  isTyping?: boolean;
  type?: "text" | "image" | "html" | "error";
};

function getMessageFromAssistantText(text: string, id: number): Message {
  function urlify(text: string) {
    // HACK: ensure URL doesn't end with common punctuation
    const urlRegex = /(https?:\/\/[^\s]+[^\.,;:\s])/g;
    return text.replace(urlRegex, function (url) {
      return (
        '<a target="_" class="underline" href="' + url + '">' + url + "</a>"
      );
    });
  }

  const htmlOrText = urlify(text);
  const type = htmlOrText === text ? "text" : "html";
  return {
    id,
    text: text,
    html: type === "html" ? htmlOrText : undefined,
    role: "assistant",
    type,
  };
}

export default function Chat() {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hey there! Welcome to Sam's website! You can ask me all sorts of questions about Sam, such as:\n
1. Tell me about Sam
2. How can I contact Sam?
3  Does he have a resume or just this weird chatbot?`,
      role: "system",
    },
  ]);

  const { isFetching, refetch, error } = useQuery(
    ["messages", messages.length],
    async () => {
      const validMessages = messages.filter(
        (m) => m.role !== "system" && m.type !== "error"
      );
      const limitedMessages = validMessages.slice(
        Math.max(validMessages.length - MESSAGE_HISTORY_LIMIT, 0)
      );

      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          messages: limitedMessages,
        }),
      });

      if (!res.ok) {
        setMessages((messages) => [
          ...messages,
          {
            role: "system",
            id: messages.length + 1,
            isTyping: false,
            text: "Something went wrong. Please try again.",
            type: "error",
          },
        ]);

        throw new Error("Failed to fetch message");
      }

      const resJson = await res.json();

      const nextMessage = resJson.nextMessage as string;

      setMessages((messages) => [
        ...messages,
        getMessageFromAssistantText(nextMessage, messages.length + 1),
      ]);

      return nextMessage;
    },
    {
      enabled: false,
    }
  );

  const handleSendMessage = (text: string) => {
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

    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, refetch]);

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
      <MessageBubble key={message.id} message={message} />
    ));
  };

  return (
    <div className="bg-gray-100 flex flex-col md:max-w-md mx-auto h-full border border-gray-300 md:rounded-lg overflow-hidden">
      <div
        ref={messageContainerRef}
        className="overflow-scroll h-full flex-grow"
      >
        <div className="p-4">{renderMessages()}</div>
      </div>
      <div className="bg-gray-100 p-4 flex items-center">
        <input
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
