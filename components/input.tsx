'use client';

import type {
    ChatRequestOptions,
    CreateMessage,
    Message,
} from 'ai';
import cx from 'classnames';
import type React from 'react';
import {
    useRef,
    useEffect,
    useState,
    useCallback,
    type Dispatch,
    type SetStateAction,
    memo,
} from 'react';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';

import { sanitizeUIMessages } from '@/lib/utils';

import { ArrowUpIcon, StopCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

function PureInput({
    input,
    setInput,
    isLoading,
    stop,
    handleSubmit,
    className,
    setMessages,
}: {
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    stop: () => void;
    setMessages: Dispatch<SetStateAction<Array<Message>>>;
    handleSubmit: (
        event?: {
            preventDefault?: () => void;
        },
        chatRequestOptions?: ChatRequestOptions,
    ) => void;
    className?: string;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { toast } = useToast()
    const { width } = useWindowSize();

    useEffect(() => {
        if (textareaRef.current) {
            adjustHeight();
        }
    }, []);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
        }
    };

    const resetHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = '98px';
        }
    };

    const [localStorageInput, setLocalStorageInput] = useLocalStorage(
        'input',
        '',
    );

    useEffect(() => {
        if (textareaRef.current) {
            const domValue = textareaRef.current.value;
            // Prefer DOM value over localStorage to handle hydration
            const finalValue = domValue || localStorageInput || '';
            setInput(finalValue);
            adjustHeight();
        }
        // Only run once after hydration
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLocalStorageInput(input);
    }, [input, setLocalStorageInput]);

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
        adjustHeight();
    };


    const submitForm = useCallback(() => {
        handleSubmit();
        setLocalStorageInput('');
        resetHeight();

        if (width && width > 768) {
            textareaRef.current?.focus();
        }
    }, [
        handleSubmit,
        setLocalStorageInput,
        width,
    ]);

    return (
        <div className="relative w-full flex flex-col gap-4">
            <Textarea
                ref={textareaRef}
                placeholder="Send a message..."
                value={input}
                onChange={handleInput}
                className={cx(
                    'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700',
                    className,
                )}
                rows={2}
                autoFocus
                onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();

                        if (isLoading) {
                            toast({
                                title: 'Please wait for the model to finish its response!',
                                variant: 'destructive',
                            });
                        } else {
                            submitForm();
                        }
                    }
                }}
            />

            <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
                {isLoading ? (
                    <StopButton stop={stop} setMessages={setMessages} />
                ) : (
                    <SendButton
                        input={input}
                        submitForm={submitForm}
                    />
                )}
            </div>
        </div>
    );
}

export const Input = memo(
    PureInput,
    (prevProps, nextProps) => {
        if (prevProps.input !== nextProps.input) return false;
        if (prevProps.isLoading !== nextProps.isLoading) return false;

        return true;
    },
);

function PureStopButton({
    stop,
    setMessages,
}: {
    stop: () => void;
    setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) {
    return (
        <Button
            className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
            onClick={(event) => {
                event.preventDefault();
                stop();
                setMessages((messages) => sanitizeUIMessages(messages));
            }}
        >
            <StopCircleIcon size={14} />
        </Button>
    );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
    submitForm,
    input,
}: {
    submitForm: () => void;
    input: string;
}) {
    return (
        <Button
            className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
            onClick={(event) => {
                event.preventDefault();
                submitForm();
            }}
            disabled={input.length === 0}
        >
            <ArrowUpIcon size={14} />
        </Button>
    );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    return true;
});