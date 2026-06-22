"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTIONS } from "@/lib/game/questions";
import { callAgent, getLlmStatus, type LlmStatus } from "@/lib/game/llm";
import type { Agent } from "@/lib/game/types";

type Props = {
  agent: Agent;
  onRecord: (q: string, a: string) => void;
  onBegin: () => void;
};

type LogItem = { q: string; typed: string; done: boolean; loading: boolean };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const GENERIC = [
  "I'd rather not commit to that.",
  "That's not something I'll reveal.",
  "You'll see when the round opens.",
  "No comment.",
  "I'll let my trades answer that.",
  "Read into that what you like.",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fallbackAnswer(agent: Agent, q: string): string {
  const bank = QUESTIONS.find(
    (x) => x.text.toLowerCase() === q.trim().toLowerCase(),
  );
  if (bank) return agent.answers[bank.id] ?? GENERIC[0]!;
  return GENERIC[hash(q) % GENERIC.length]!;
}

export function InterrogationRoom({ agent, onRecord, onBegin }: Props) {
  const [log, setLog] = useState<LogItem[]>([]);
  const [customQ, setCustomQ] = useState("");
  const [status, setStatus] = useState<LlmStatus>({ enabled: false, model: "" });
  const timers = useRef<number[]>([]);
  const cancelled = useRef(false);
  const recorded = useRef<Set<number>>(new Set());
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

  const busy = log.some((l) => l.loading);
  const count = log.length;
  const locked = count >= 3;
  const ready = count === 3 && log.every((l) => l.done);

  const ask = (raw: string) => {
    const q = raw.trim();
    if (!q || locked || busy) return;
    const i = log.length;
    setLog((prev) => [...prev, { q, typed: "", done: false, loading: true }]);
    setCustomQ("");

    void (async () => {
      const fetchP = statusRef.current.enabled
        ? callAgent({
            mode: "interrogate",
            codename: agent.codename,
            objective: agent.objective,
            evasiveness: agent.evasiveness,
            question: q,
          })
        : Promise.resolve<string | null>(null);

      const [llm] = await Promise.all([fetchP, wait(450)]);
      if (cancelled.current) return;
      const answer = llm ?? fallbackAnswer(agent, q);

      setLog((prev) => prev.map((it, j) => (j === i ? { ...it, loading: false } : it)));
      let c = 0;
      const step = () => {
        if (cancelled.current) return;
        c += 1;
        const done = c >= answer.length;
        setLog((prev) =>
          prev.map((it, j) =>
            j === i ? { ...it, typed: answer.slice(0, c), done } : it,
          ),
        );
        if (done) {
          if (!recorded.current.has(i)) {
            recorded.current.add(i);
            onRecord(q, answer);
          }
        } else {
          const id = window.setTimeout(step, 22);
          timers.current.push(id);
        }
      };
      const start = window.setTimeout(step, 140);
      timers.current.push(start);
    })();
  };

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

      {/* ask */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
            Ask anything
          </h3>
          <span className="label">{locked ? "complete" : `${3 - count} left`}</span>
        </div>
        <p className="mt-1.5 text-sm text-ink-muted">
          Type your own question — it must answer, but it can lie by omission. Or
          tap a suggestion.
        </p>

        {/* engine status */}
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-surface-soft px-3 py-2">
          <span className={`h-2 w-2 rounded-full ${status.enabled ? "bg-brand" : "bg-ink-faint"}`} />
          <span className="font-mono text-[0.7rem] text-ink-muted">
            {status.enabled ? (
              <>
                Live model · <span className="text-ink">{status.model.replace(":free", "")}</span>
              </>
            ) : (
              "Scripted agent (set OPENROUTER_API_KEY for free-form answers)"
            )}
          </span>
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(customQ);
          }}
        >
          <input
            type="text"
            value={customQ}
            disabled={locked || busy}
            onChange={(e) => setCustomQ(e.target.value)}
            placeholder={locked ? "No questions left" : "e.g. Are you going to betray me?"}
            className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-brand/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={locked || busy || !customQ.trim()}
            className="btn-primary justify-center px-4 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Ask
          </button>
        </form>

        <div className="mt-4">
          <div className="label mb-2">Suggestions</div>
          <div className="flex flex-wrap gap-2">
            {QUESTIONS.map((q) => (
              <button
                key={q.id}
                type="button"
                disabled={locked || busy}
                onClick={() => ask(q.text)}
                className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-ink transition-colors hover:border-brand/40 hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={!ready}
          onClick={onBegin}
          className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
        >
          {count < 3 ? `Ask ${3 - count} more to begin` : "Open the trading round →"}
        </button>
      </div>
    </div>
  );
}
