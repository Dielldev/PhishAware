import { cn } from "@/lib/utils";

export const hoverGlowAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  whileHover: { scale: 1.02 },
  transition: { duration: 0.2 }
};

export const glowVariants = {
  hover: {
    boxShadow: "0 0 20px 2px rgba(71, 243, 171, 0.2)",
    borderColor: "rgba(71, 243, 171, 0.5)",
    transition: { duration: 0.3 }
  }
};

export const fadeUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export const cardStyles = {
  container: "relative group cursor-pointer",
  glowEffect: "absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500",
  content: "relative bg-dark-200 rounded-xl border border-dark-100 p-6 transition-all duration-300"
};