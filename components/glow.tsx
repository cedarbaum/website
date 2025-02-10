import { AnimatePresence, motion } from 'framer-motion';
import { FC, useRef } from 'react';
import { useResizeObserver } from 'usehooks-ts';

interface GlowProps {
  children?: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
  visible?: boolean;
}

const Glow: FC<GlowProps> = ({ children, className = '', width, height, visible = true }) => {

  let clipPath = 'none';
  if (width && height) {
    const aspectRatio = width / height;
    const insetPercentageWidth = 3;
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
  } else {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={'glow'}
          className={`absolute top-0 left-0 rainbow-glow overflow-visible ${className}`}
          initial={{
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            zIndex: 0
          }}
          animate={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          exit={{
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            zIndex: 0,
            transition: {
              duration: 0.5,
              ease: 'easeInOut'
            }
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence >
  );
};

export default Glow;
