// components/ScrollRevealWrapper.tsx
import { motion } from 'framer-motion';

interface Props {
    children: React.ReactNode;
}

const ScrollRevealWrapper: React.FC<Props> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollRevealWrapper;
