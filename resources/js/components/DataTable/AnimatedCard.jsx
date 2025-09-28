import { motion } from "framer-motion";

export default function AnimatedCard({
  children,
  className = "",
  initial = { y: -20, opacity: 0 },
  animate = { y: 0, opacity: 1 },
  transition = { duration: 0.4 },
  whileHover,
  ...props
}) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={whileHover}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
