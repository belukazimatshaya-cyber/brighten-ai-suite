import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 flex flex-wrap items-end justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow"
            style={{ background: "var(--gradient-hero)" }}
          >
            {icon}
          </div>
        )}
        <div>
          {eyebrow && (
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-3xl font-bold md:text-4xl">{title}</h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}
