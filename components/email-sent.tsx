import { ArrowLeftIcon, MailIcon } from "lucide-react";

interface EmailSentProps {
    message: string;
    from?: string;
    error?: string;
    subject?: string;
}

export default function EmailSent({ message, from, subject, error }: EmailSentProps) {
    return (
        <div className="flex flex-col rounded-xl border">
            <nav className="flex flex-row items-center gap-2 border-b px-4 py-2">
                <MailIcon className="h-4 w-4" />
                Email Sent
            </nav>
            {from && (
                <div className="border-b pb-2 w-full px-4 py-2">
                    <p><span className="text-muted-foreground">From:</span> {from}</p>
                </div>
            )}
            {subject && (
                <div className="border-b pb-2 w-full px-4 py-2">
                    <p><span className="text-muted-foreground">Subject:</span> {subject}</p>
                </div>
            )}
            <p className="px-4 py-2">{message}</p>
        </div>
    )
}