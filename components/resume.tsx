import { useRef, useState } from "react";
import { cx } from "class-variance-authority";
import { Button } from "./ui/button";
import { ExpandIcon, DownloadIcon, FileTextIcon, MinimizeIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useScrollController } from "@/hooks/use-scroll-controller";
interface Resume {
    resumeLink: string;
    downloadLink: string;
}

export function Resume({ resume }: { resume: Resume }) {
    const frameRef = useRef<HTMLDivElement>(null);
    const resumeContainerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const scrollController = useScrollController();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (frameRef.current) {
            const { top, left, width, height } = frameRef.current.getBoundingClientRect();
            if (!isFullscreen) {
                // Set initial position of resume container
                scrollController.pauseScrollToBottom();
                resumeContainerRef.current?.style.setProperty('position', 'fixed');
                resumeContainerRef.current?.style.setProperty('top', `${top}px`);
                resumeContainerRef.current?.style.setProperty('left', `${left}px`);
                resumeContainerRef.current?.style.setProperty('width', `${width}px`);
                resumeContainerRef.current?.style.setProperty('height', `${height}px`);
                resumeContainerRef.current?.style.setProperty('z-index', '100');
                resumeContainerRef.current?.style.setProperty('transition', 'none');

                requestAnimationFrame(() => {
                    resumeContainerRef.current?.style.setProperty('transition', 'all 0.3s ease-in-out');
                    resumeContainerRef.current?.style.setProperty('top', '0');
                    resumeContainerRef.current?.style.setProperty('left', '0');
                    resumeContainerRef.current?.style.setProperty('width', '100%');
                    resumeContainerRef.current?.style.setProperty('height', '100%');
                    resumeContainerRef.current?.style.setProperty('border-radius', '0');
                });
            } else {
                resumeContainerRef.current?.style.setProperty('transition', 'all 0.3s ease-in-out');
                resumeContainerRef.current?.style.setProperty('top', `${top}px`);
                resumeContainerRef.current?.style.setProperty('left', `${left}px`);
                resumeContainerRef.current?.style.setProperty('width', `${width}px`);
                resumeContainerRef.current?.style.setProperty('height', `${height}px`);
                resumeContainerRef.current?.style.setProperty('border-radius', '1rem');

                const abortController = new AbortController();
                resumeContainerRef.current?.addEventListener('transitionend', () => {
                    setTimeout(() => {
                        resumeContainerRef.current?.style.setProperty('transition', 'none');
                        resumeContainerRef.current?.style.setProperty('position', 'absolute');
                        resumeContainerRef.current?.style.setProperty('top', '0');
                        resumeContainerRef.current?.style.setProperty('left', '0');
                        resumeContainerRef.current?.style.setProperty('width', '100%');
                        resumeContainerRef.current?.style.setProperty('height', '100%');
                        resumeContainerRef.current?.style.setProperty('z-index', 'none');
                    }, 100);

                    setTimeout(() => {
                        scrollController.unpauseScrollToBottom();
                    }, 500);

                    abortController.abort();
                }, { signal: abortController.signal });
            }

            setIsFullscreen(!isFullscreen);
        }
    }

    return (
        <div ref={frameRef} className="relative w-full h-[500px]">
            <div ref={resumeContainerRef} className="flex flex-col absolute inset-0 rounded-2xl overflow-hidden border">
                <ResumeContent
                    resumeLink={resume.resumeLink}
                    downloadLink={resume.downloadLink}
                    isFullscreen={isFullscreen}
                    toggleFullscreen={toggleFullscreen}
                    iframeRef={iframeRef} />
            </div>
        </div>
    );
}


interface ResumeContentProps {
    resumeLink: string;
    downloadLink: string;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    iframeRef: React.RefObject<HTMLIFrameElement>;
}

function ResumeContent({ resumeLink, downloadLink, isFullscreen, toggleFullscreen, iframeRef }: ResumeContentProps) {
    const [isLoading, setIsLoading] = useState(true);
    return (
        <div className="relative flex flex-col w-full h-full">
            <nav className="absolute px-2 flex justify-between items-center w-full h-[62px] bg-black border">
                <div className="flex items-center gap-2 font-lg">
                    <FileTextIcon />
                    <span className="text-sm font-medium">Resume</span>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => window.open(downloadLink, '_blank')}>
                        <DownloadIcon />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                    >
                        {isFullscreen ? <MinimizeIcon /> : <ExpandIcon />}
                    </Button>
                </div>
            </nav>
            {isLoading && (
                <div className="absolute top-[62px] left-0 right-0 bottom-0 p-4 bg-black">
                    <ResumeSkeleton />
                </div>
            )}
            <iframe
                ref={iframeRef}
                onLoad={() => setIsLoading(false)}
                src={resumeLink}
                className={cx(
                    "w-full h-full border-black",
                    !isFullscreen && "pointer-events-none overflow-hidden"
                )}
            />
            {!isFullscreen &&
                <div onClick={toggleFullscreen} className="absolute top-[62px] left-0 right-0 bottom-0" />
            }
        </div>
    );
}

const ResumeSkeleton = () => {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[150px] rounded-xl" />
            <div className="space-y-2 mt-8">
                <Skeleton className="h-6 w-[300px]" />
                <Skeleton className="h-6 w-[300px]" />
            </div>
            <div className="space-y-2 mt-8">
                <Skeleton className="h-6 w-[300px]" />
                <Skeleton className="h-6 w-[300px]" />
            </div>
            <div className="space-y-2 mt-8">
                <Skeleton className="h-6 w-[300px]" />
                <Skeleton className="h-6 w-[300px]" />
            </div>
            <div className="space-y-2 mt-8">
                <Skeleton className="h-6 w-[300px]" />
                <Skeleton className="h-6 w-[300px]" />
            </div>
        </div>
    );
}