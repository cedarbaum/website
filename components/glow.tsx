import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

interface GlowProps {
  className?: string;
  visible?: boolean;
}

const Glow: FC<GlowProps> = ({ className = '', visible = true }) => {
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
        />
      )}
    </AnimatePresence >
  );
};

export default Glow;
