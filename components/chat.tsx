import { useChat } from "ai/react";
import { Messages } from "./messages";
import { Input } from "./input";
import { useToast } from "@/hooks/use-toast";
import Glow from "./glow";
import { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";

export default function Chat() {
  const { toast } = useToast();
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    isLoading,
    stop,
    append,
  } = useChat({
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    onError: (error) => {
      console.error(error);
      toast({
        title: "An error occured, please try again!",
        description: error.message,
      });
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver({
    ref: containerRef,
  });

  const [isFocused, setIsFocused] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    if (isLoading || isFocused) {
      setShowGlow(true);
    } else {
      const timeout = setTimeout(() => {
        setShowGlow(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isFocused]);

  return (
    <div ref={containerRef} className="overflow-visible relative justify-center items-center flex flex-col h-full text-foreground">
      <Glow width={width} height={height} visible={showGlow} />
      <div className="relative flex flex-col w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-lg overflow-hidden bg-background border-white/10">
        <Messages
          isLoading={isLoading}
          messages={messages}
          setMessages={setMessages}
        />
        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <Input
            input={input}
            setInput={setInput}
            handleSubmit={() => {
              setIsFocused(false);
              handleSubmit();
            }}
            isLoading={isLoading}
            stop={stop}
            setMessages={setMessages}
            messages={messages}
            append={append}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </form>
      </div>
    </div >
  )
}