import { ChatRequestOptions, Message } from 'ai';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { Overview } from './overview';

interface MessagesProps {
    isLoading: boolean;
    messages: Array<Message>;
    setMessages: (
        messages: Message[] | ((messages: Message[]) => Message[]),
    ) => void;
}

function PureMessages({
    isLoading,
    messages,
}: MessagesProps) {
    const [messagesContainerRef, messagesEndRef] =
        useScrollToBottom<HTMLDivElement>();

    return (
        <div
            ref={messagesContainerRef}
            className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-8"
        >
            {messages.length === 0 && <Overview />}

            {messages.map((message, index) => (
                <PreviewMessage
                    key={message.id}
                    message={message}
                />
            ))}

            {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

            <div
                ref={messagesEndRef}
                className="shrink-0 min-w-[24px] min-h-[24px]"
            />
        </div>
    );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.isLoading && nextProps.isLoading) return false;
    if (prevProps.messages.length !== nextProps.messages.length) return false;
    if (!equal(prevProps.messages, nextProps.messages)) return false;

    return true;
});