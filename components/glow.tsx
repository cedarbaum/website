import { FC } from 'react';

interface GlowProps {
    children?: React.ReactNode;
    className?: string;
}

const Glow: FC<GlowProps> = ({ children, className = '' }) => {
    return (
        <div className={`rainbow-glow ${className}`}>
            {children}
            <style jsx>{`
        .rainbow-glow {
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
          filter: blur(10px);
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
