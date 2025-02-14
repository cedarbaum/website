import { motion } from 'framer-motion';
import Link from 'next/link';

export const Overview = () => {
    return (
        <motion.div
            key="overview"
            className="max-w-3xl mx-auto md:mt-20"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ delay: 0.5 }}
        >
            <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
                <p className="flex flex-row justify-center gap-4 items-center">
                </p>
                <p>
                    Hey, I am Sam, a full-stack software engineer based in New York City.
                </p>
            </div>
        </motion.div>
    );
};