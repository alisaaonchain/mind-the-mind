"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "@/lib/game/questions";
import { callAgent, getLlmStatus, type LlmStatus } from "@/lib/game/llm";
import type { Agent } from "@/lib/game/types";

type Props = {
  agent: Agent;
  asked: string[];
  onAsk: (qId: string) => void;
  onBegin: () => void;
};

type LogItem = { q: string; typed: string; done: boolean; loading: boolean };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function InterrogationRoom({ agent, asked, onAsk, onBegin }: Props) {
  const [log, setLog] = useState<LogItem[]>([]);
  const [status, setStatus] = useState<LlmStatus>({ enabled: false, model: "" });
  const timers = useRef<number[]>([]);
  const processed = useRef(0);
  const cancelled = useRef(false);
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    getLlmStatus().then(setStatus);
  }, []);

  useEffect(() => {
    const t = timers.current;
    return () => {
      cancelled.current = true;
      t.forEach((id) => clearTimeout(id));
    };
  }, []);

  // process each newly-asked question: fetch answer (live model or fallback), then typewrite
  useEffect(() => {
    if (asked.length <= processed.current) return;
    const i = processed.current;
    processed.current = asked.length;
    const qId = asked[i]!;
    const q = QUESTIONS.find((x) => x.id === qId);
    if (!q) return;

    setLog((prev) => [...prev, { q: q.text, typed: "", done: false, loading: true }]);

    (async () => {
      const fallback = agent.answers[qId] ?? "No comment.";
      const fetchP = statusRef.current.enabled
        ? callAgent({
            mode: "interrogate",
            codename: agent.codename,
            objective: agent.objective,
            evasiveness: agent.evasiveness,
            question: q.text,
          })
        : Promise.resolve<string | null>(null);

      const [llm] = await Promise.all([fetchP, wait(500)]);
      if (cancelled.current) return;
      const answer = llm ?? fallback;

      setLog((prev) => prev.map((it, j) => (j === i ? { ...it, loading: false } : it)));
      let c = 0;
      const step = () => {
        if (cancelled.current) return;
        c += 1;
        setLog((prev) =>
          prev.map((it, j) =>
            j === i ? { ...it, typed: answer.slice(0, c), done: c >= answer.length } : it,
          ),
        );
        if (c < answer.length) {
          const id = window.setTimeout(step, 22);
          timers.current.push(id);
        }
      };
      const start = window.setTimeout(step, 160);
      timers.current.push(start);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asked]);

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
                  <p className="text-[0.95rem] font-medium leading-snug text-ink">{it.q}</p>
                  <div className="mt-2.5 rounded-lg bg-surface-soft px-3.5 py-2.5">
                    <div className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-brand">
                      {agent.name}
                    </div>
                    {it.loading ? (
                      <p className="flex items-center font-mono text-sm text-accent">
                        analysing
                        <span className="thinking ml-1">
                          <span />
                          <span />
                          <span />
                        </span>
                      </p>
                    ) : (
                      <p
                        className={`font-mono text-sm leading-relaxed text-ink-soft ${
                          it.done ? "" : "caret"
                        }`}
                      >
                        {it.typed}
                      </p>
                    )}
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
          <span className="label">{remaining > 0 ? `${remaining} left` : "complete"}</span>
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">
          It must answer — but it can lie by omission. Choose what to probe.
        </p>

        {/* engine status */}
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-surface-soft px-3 py-2">
          <span className={`h-2 w-2 rounded-full ${status.enabled ? "bg-brand" : "bg-ink-faint"}`} />
          <span className="font-mono text-[0.7rem] text-ink-muted">
            {status.enabled ? (
              <>
                Live model ·{" "}
                <span className="text-ink">{status.model.replace(":free", "")}</span>
              </>
            ) : (
              "Scripted agent (set OPENROUTER_API_KEY for a live model)"
            )}
          </span>
        </div>

        <div className="mt-4 space-y-2">
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
          {asked.length < 3 ? `Ask ${3 - asked.length} more to begin` : "Open the trading round →"}
        </button>
      </div>
    </div>
  );
}
