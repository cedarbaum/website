'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
    append: (
        message: Message | CreateMessage,
        chatRequestOptions?: ChatRequestOptions,
    ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ append }: SuggestedActionsProps) {
    const suggestedActions = [
        {
            title: 'Sam\'s Resume',
            label: 'View Sam\'s resume',
            action: 'View Sam\'s resume',
        },
        {
            title: 'Contact',
            label: `Contact Sam`,
            action: `Contact Sam`,
        },
        {
            title: 'Message',
            label: `Send a message to Sam`,
            action: `Send a message to Sam`,
        },
        {
            title: 'Weather',
            label: `Get the weather in NYC`,
            action: `Get the weather in New York City`,
        }
    ];

    return (
        <div className="grid sm:grid-cols-2 gap-2 w-full">
            {suggestedActions.map((suggestedAction, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.05 * index }}
                    key={`suggested-action-${suggestedAction.title}-${index}`}
                    className={index > 1 ? 'hidden sm:block' : 'block'}
                >
                    <Button
                        variant="ghost"
                        onClick={async () => {
                            append({
                                role: 'user',
                                content: suggestedAction.action,
                            });
                        }}
                        className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
                    >
                        <span className="font-medium">{suggestedAction.title}</span>
                        <span className="text-muted-foreground">
                            {suggestedAction.label}
                        </span>
                    </Button>
                </motion.div>
            ))}
        </div>
    );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);