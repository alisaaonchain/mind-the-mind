"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "@/lib/game/questions";
import type { Agent } from "@/lib/game/types";

type Props = {
  agent: Agent;
  asked: string[];
  onAsk: (qId: string) => void;
  onBegin: () => void;
};

type LogItem = { q: string; a: string; typed: string; done: boolean };

export function InterrogationRoom({ agent, asked, onAsk, onBegin }: Props) {
  const [log, setLog] = useState<LogItem[]>([]);
  const timers = useRef<number[]>([]);

  // when a new question gets asked, append it and typewrite the answer
  useEffect(() => {
    if (asked.length === log.length) return;
    const qId = asked[asked.length - 1]!;
    const q = QUESTIONS.find((x) => x.id === qId);
    if (!q) return;
    const answer = agent.answers[qId] ?? "No comment.";
    const item: LogItem = { q: q.text, a: answer, typed: "", done: false };
    const idx = log.length;
    setLog((prev) => [...prev, item]);

    let c = 0;
    const step = () => {
      c += 1;
      setLog((prev) =>
        prev.map((it, i) =>
          i === idx
            ? { ...it, typed: answer.slice(0, c), done: c >= answer.length }
            : it,
        ),
      );
      if (c < answer.length) {
        const id = window.setTimeout(step, 22);
        timers.current.push(id);
      }
    };
    const start = window.setTimeout(step, 420);
    timers.current.push(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asked]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => clearTimeout(id));
  }, []);

  const remaining = 3 - asked.length;
  const ready = asked.length === 3 && log.every((l) => l.done);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* transcript */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="dot animate-blink" />
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
              Interrogation · {agent.name}
            </span>
          </div>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-accent-ink">
            {agent.codename}
          </span>
        </div>

        <div className="min-h-[320px] px-5 py-5">
          {log.length === 0 ? (
            <p className="font-mono text-sm text-ink-faint">
              <span className="text-brand">awaiting&gt;</span> Ask your first
              question. You only get three.
            </p>
          ) : (
            <ol className="space-y-4">
              {log.map((it, i) => (
                <li key={i}>
                  <div className="mb-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-faint">
                    Q{i + 1} · you
                  </div>
                  <p className="text-[0.95rem] font-medium leading-snug text-ink">
                    {it.q}
                  </p>
                  <div className="mt-2.5 rounded-lg bg-surface-soft px-3.5 py-2.5">
                    <div className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-brand">
                      {agent.name}
                    </div>
                    <p
                      className={`font-mono text-sm leading-relaxed text-ink-soft ${
                        it.done ? "" : "caret"
                      }`}
                    >
                      {it.typed}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* question bank */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
            Pick your questions
          </h3>
          <span className="label">
            {remaining > 0 ? `${remaining} left` : "complete"}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">
          It must answer — but it can lie by omission. Choose what to probe.
        </p>

        <div className="mt-5 space-y-2">
          {QUESTIONS.map((q) => {
            const used = asked.includes(q.id);
            const locked = asked.length >= 3;
            return (
              <button
                key={q.id}
                type="button"
                disabled={used || locked}
                onClick={() => onAsk(q.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  used
                    ? "border-brand/30 bg-brand-soft text-ink-faint"
                    : locked
                      ? "cursor-not-allowed border-line text-ink-faint opacity-50"
                      : "border-line text-ink hover:border-brand/40 hover:bg-surface-soft"
                }`}
              >
                {used ? <span className="mr-1.5 text-brand">✓</span> : null}
                {q.text}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!ready}
          onClick={onBegin}
          className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
        >
          {asked.length < 3
            ? `Ask ${3 - asked.length} more to begin`
            : "Open the trading round →"}
        </button>
      </div>
    </div>
  );
}
