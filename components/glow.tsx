import { FC, useRef } from 'react';
import { useResizeObserver } from 'usehooks-ts';

interface GlowProps {
    children?: React.ReactNode;
    className?: string;
}

const Glow: FC<GlowProps> = ({ children, className = '' }) => {
    const glowRef = useRef<HTMLDivElement>(null);
    const { width, height } = useResizeObserver({
        ref: glowRef,
    });

    let clipPath = 'none';
    if (width && height) {
        const aspectRatio = width / height;
        const insetPercentageWidth = 2;
        const insetPercentageHeight = insetPercentageWidth * aspectRatio;
        console.log(width, height, aspectRatio, insetPercentageWidth, insetPercentageHeight);
        clipPath = `polygon(
        0 0,
        100% 0,
        100% 100%,
        0 100%,
        0 0,
        ${insetPercentageWidth}% ${insetPercentageHeight}%,
        ${insetPercentageWidth}% calc(100% - ${insetPercentageHeight}%),
        calc(100% - ${insetPercentageWidth}%) calc(100% - ${insetPercentageHeight}%),
        calc(100% - ${insetPercentageWidth}%) ${insetPercentageHeight}%,
        ${insetPercentageWidth}% ${insetPercentageHeight}%
    )`;
    }

    return (
        <div ref={glowRef} className={`rainbow-glow overflow-visible ${className}`}>
            {children}
            <style jsx>{`
        .rainbow-glow {
        filter: blur(4px) saturate(1.8);
        pointer-events: none;
        }

        .rainbow-glow::before {
          content: '';
          pointer-events: none;
          position: absolute;
          background-color: red;
          overflow: visible;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(
            45deg,
            #ff0000,
            #ff8000,
            #ffff00,
            #00ff00,
            #00ffff,
            #0000ff,
            #8000ff,
            #ff0080
          );
          background-size: 400% 400%;
          animation: rainbow 15s ease infinite;
          padding: 1rem;
          border-radius: 0.5rem;
  clip-path: ${clipPath};
        }

        @keyframes rainbow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
        </div>
    );
};

export default Glow;
