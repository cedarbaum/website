import { useEffect, useRef, useState } from "react";
import { cx } from "class-variance-authority";
import { Button } from "./ui/button";
import { ExpandIcon, DownloadIcon, FileTextIcon, MinimizeIcon } from "lucide-react";
import { motion, useAnimate } from "framer-motion";
interface Resume {
    resumeLink: string;
}

enum AnimationState {
    INITIAL,
    ANIMATING_TO_FULLSCREEN,
    ANIMATING_TO_NORMAL,
    IS_FULLSCREEN,
}

export function Resume({ resume }: { resume: Resume }) {
    const frameRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [boundingBox, setBoundingBox] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0
    });
    const [animationRunning, setAnimationRunning] = useState(false);
    const [animationState, setAnimationState] = useState(AnimationState.INITIAL);

    const toggleFullscreen = () => {
        if (frameRef.current) {
            if (isFullscreen) {
                setAnimationState(AnimationState.ANIMATING_TO_NORMAL);
            } else {
                setAnimationState(AnimationState.ANIMATING_TO_FULLSCREEN);
            }
            const { top, left, width, height } = frameRef.current.getBoundingClientRect();
            setBoundingBox({ top, left, width, height });
            setIsFullscreen(!isFullscreen);
            setAnimationRunning(true);
        }
    }

    const onAnimationEnd = () => {
        console.log('Animation ended')
        setAnimationRunning(false);
        if (isFullscreen) {
            setAnimationState(AnimationState.IS_FULLSCREEN);
        }
    }

    const absoluteBoundingBox = {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'absolute'
    };

    const fixedAnimationStartBoundingBox = {
        top: boundingBox.top,
        left: boundingBox.left,
        width: boundingBox.width,
        height: boundingBox.height,
        position: 'fixed'
    };

    const fixedAnimationEndBoundingBox = {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'fixed'
    };

    let initial, animate = {}

    switch (animationState) {
        case AnimationState.INITIAL:
            initial = absoluteBoundingBox;
            break;
        case AnimationState.IS_FULLSCREEN:
            initial = fixedAnimationEndBoundingBox;
            animate = fixedAnimationEndBoundingBox;
            break;
        case AnimationState.ANIMATING_TO_FULLSCREEN:
            initial = fixedAnimationStartBoundingBox
            animate = fixedAnimationEndBoundingBox
            break;
        case AnimationState.ANIMATING_TO_NORMAL:
            initial = fixedAnimationEndBoundingBox
            animate = fixedAnimationStartBoundingBox
            break;
    }

    console.log(initial, animate, animationRunning)

    return (
        <div ref={frameRef} className="relative w-full h-[500px]">
            <motion.div
                onAnimationEnd={onAnimationEnd}
                initial={initial}
                animate={animate}
                className={cx(
                    'flex flex-col skeleton-bg',
                    (isFullscreen || animationRunning) && 'z-50',
                )}
            >
                <div className="relative flex flex-col w-full h-full rounded-2xl overflow-hidden">
                    <nav className="absolute px-2 flex justify-between items-center w-full h-[62px] bg-black border border-blue">
                        <div className="flex items-center gap-2 font-lg">
                            <FileTextIcon />
                            <span className="text-sm font-medium">Resume</span>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon">
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
                    <iframe
                        scrolling="no"
                        src={resume.resumeLink}
                        className={cx(
                            "w-full h-full overflow-hidden",
                            isFullscreen ? "" : "pointer-events-none"
                        )}
                    />
                </div>
            </motion.div>
        </div>
    );
}