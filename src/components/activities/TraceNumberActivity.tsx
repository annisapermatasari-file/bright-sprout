"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityComponentProps, ChildSafeOption } from "@/types/learning";

// How far the child needs to drag (in SVG user units, viewBox is 200x200)
// before a trace attempt counts as "done". Not real handwriting
// recognition — just enough motion that an accidental tap doesn't complete
// it, matching how tracing exercises work in most early-numeracy apps.
const TRACE_LENGTH_THRESHOLD = 260;

/**
 * TRACE_NUMBER: there's no "wrong" option here — the seeded question has a
 * single always-correct option (see prisma/seed.ts), and finishing the
 * trace gesture itself calls onSelect(option.id), submitting through the
 * exact same flow as every other activity.
 */
export function TraceNumberActivity({ question, answerState, onSelect, disabled }: ActivityComponentProps) {
  const option = ((question.options as ChildSafeOption[] | null) ?? [])[0];
  const numeral = option?.label ?? "";
  const answered = answerState.status === "answered";
  const locked = answered || Boolean(disabled);

  const [path, setPath] = useState<string>("");
  const drawing = useRef(false);
  const length = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);

  function pointFromEvent(event: React.PointerEvent<SVGSVGElement>) {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 200;
    const y = ((event.clientY - rect.top) / rect.height) * 200;
    return { x, y };
  }

  function handlePointerDown(event: React.PointerEvent<SVGSVGElement>) {
    if (locked) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    drawing.current = true;
    last.current = point;
    setPath((current) => `${current} M ${point.x} ${point.y}`);
  }

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!drawing.current || locked) return;
    const point = pointFromEvent(event);
    if (last.current) {
      length.current += Math.hypot(point.x - last.current.x, point.y - last.current.y);
    }
    last.current = point;
    setPath((current) => `${current} L ${point.x} ${point.y}`);
  }

  function handlePointerUp() {
    drawing.current = false;
    if (!locked && option && length.current >= TRACE_LENGTH_THRESHOLD) {
      onSelect(option.id);
    }
  }

  function clearTrace() {
    if (locked) return;
    setPath("");
    length.current = 0;
    last.current = null;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-2xl font-semibold leading-relaxed sm:text-3xl">
        Jiplak angka {numeral} dengan jarimu
      </p>
      <div className={cn("trace-board", answered && "trace-board-done")}>
        <svg
          viewBox="0 0 200 200"
          className="trace-svg"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          role="img"
          aria-label={`Area jiplak angka ${numeral}`}
        >
          <text x="100" y="150" textAnchor="middle" className="trace-numeral-outline">{numeral}</text>
          {path ? <path d={path} className="trace-stroke" /> : null}
        </svg>
        {answered ? <span className="trace-check celebrate" aria-hidden>✓</span> : null}
      </div>
      {!locked ? (
        <button type="button" className="trace-clear-button" onClick={clearTrace}>
          Ulangi ↺
        </button>
      ) : null}
    </div>
  );
}
