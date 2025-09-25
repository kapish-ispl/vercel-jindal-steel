'use client';
import { FC } from 'react';
import { motion } from 'framer-motion';

const AnimatedPin: FC<{ stateId: string; className: string; }> = ({ stateId, className }) => {
    return (
        <motion.div
            className={className}
            initial={{ y: -5 }}
            animate={{ y: [0, -10, 0], }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 0.5,
            }}
        >
            <div id={stateId} className="icon-map-pin"></div>
        </motion.div>
    );
};

export default AnimatedPin;