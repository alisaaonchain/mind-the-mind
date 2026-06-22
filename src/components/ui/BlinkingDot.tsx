type Props = {
  className?: string;
  label?: string;
};

export function BlinkingDot({ className = "", label }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-acid opacity-60 animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-acid shadow-glow animate-blink" />
      </span>
      {label ? (
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-acid-dim">
          {label}
        </span>
      ) : null}
    </span>
  );
}
