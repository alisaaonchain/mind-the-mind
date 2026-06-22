import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
};

/**
 * Adds the four lab-style corner brackets to a panel.
 * Pair with .bg-ink-panel and a hairline border for the full effect.
 */
export function CornerFrame({ children, className = "", as: Tag = "div" }: Props) {
  return (
    <Tag className={`bracketed ${className}`}>
      <span className="br-tr" aria-hidden />
      <span className="br-bl" aria-hidden />
      {children}
    </Tag>
  );
}
