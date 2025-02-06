'use client';

import type { Message } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';


import { SparklesIcon, } from 'lucide-react';
import { Markdown } from './markdown';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';

const PurePreviewMessage = ({
    message,
}: {
    message: Message;
}) => {
    const [mode, setMode] = useState<'view' | 'edit'>('view');

    return (
        <AnimatePresence>
            <motion.div
                className="w-full mx-auto max-w-3xl px-4 group/message"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                data-role={message.role}
            >
                <div
                    className={cn(
                        'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
                        {
                            'w-full': mode === 'edit',
                            'group-data-[role=user]/message:w-fit': mode !== 'edit',
                        },
                    )}
                >
                    {message.role === 'assistant' && (
                        <div className="size-8 flex items-center justify-center">
                            <div className="translate-y-px">
                                <SparklesIcon size={14} />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 w-full">
                        {(message.content || message.reasoning) && mode === 'view' && (
                            <div className="flex flex-row gap-2 items-start">
                                <div
                                    className={cn('flex flex-col gap-4', {
                                        'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                                            message.role === 'user',
                                    })}
                                >
                                    <Markdown>{message.content as string}</Markdown>
                                </div>
                            </div>
                        )}
                        {message.toolInvocations && message.toolInvocations.length > 0 && (
                            <div className="flex flex-col gap-4">
                                {message.toolInvocations.map((toolInvocation) => {
                                    const { toolName, toolCallId, state, args } = toolInvocation;

                                    if (state === 'result') {
                                        const { result } = toolInvocation;

                                        return (
                                            <div key={toolCallId}>
                                                <pre>{JSON.stringify(result, null, 2)}</pre>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={toolCallId}
                                            className={cx({
                                                skeleton: ['getWeather'].includes(toolName),
                                            })}
                                        >
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export const PreviewMessage = memo(
    PurePreviewMessage,
    (prevProps, nextProps) => {
        if (prevProps.message.reasoning !== nextProps.message.reasoning)
            return false;
        if (prevProps.message.content !== nextProps.message.content) return false;
        if (
            !equal(
                prevProps.message.toolInvocations,
                nextProps.message.toolInvocations,
            )
        )
            return false;
        return true;
    },
);

export const ThinkingMessage = () => {
    const role = 'assistant';

    return (
        <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message "
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
            data-role={role}
        >
            <div
                className={cx(
                    'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
                    {
                        'group-data-[role=user]/message:bg-muted': true,
                    },
                )}
            >
                <div className="size-8 flex items-center justify-center">
                    <SparklesIcon size={14} />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col gap-4 text-muted-foreground">
                        Thinking...
                    </div>
                </div>
            </div>
        </motion.div>
    );
};