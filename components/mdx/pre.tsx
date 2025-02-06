"use client"

import {
    ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

export function Pre({ children, className }: any) {
    const [clipboardShown, setClipboardShown] = useState(false);
    const preRef = useRef<HTMLPreElement | null>(null);

    const onMouseEnter = () => {
        setClipboardShown(true);
    };

    const onMouseLeave = () => {
        setClipboardShown(false);
    };

    const onClipboardClick = () => {
        navigator.clipboard.writeText(preRef.current?.innerText ?? "");
        toast("Copied to clipboard", {
            icon: "✂️",
        });
    };

    return (
        <pre
            className={`${className ?? ""} relative`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={preRef}
        >
            {clipboardShown && (
                <div className="flex flex-col justify-center absolute top-0 right-4 h-full">
                    <ClipboardDocumentIcon
                        className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100"
                        onClick={onClipboardClick}
                    />
                </div>
            )}
            {children}
        </pre>
    );
}