"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityComponentProps, ChildSafeOption } from "@/types/learning";

/**
 * DRAG_MATCH: same option/correctAnswer shape as OptionChoiceActivity —
 * prompt's first line is the item to match, options are the drop targets.
 * Real pointer-based dragging (not native HTML5 drag-and-drop, which
 * doesn't work on touch screens without polyfills): the chip follows the
 * pointer via a CSS transform while dragging, and on release we hit-test
 * against each target's bounding box. Dropping on the wrong target still
 * calls onSelect (and submits) exactly like every other activity type.
 */
export function DragMatchActivity({ question, answerState, onSelect, disabled }: ActivityComponentProps) {
  const options = (question.options as ChildSafeOption[] | null) ?? [];
  const answered = answerState.status === "answered";
  const locked = answered || Boolean(disabled);
  const promptLines = question.prompt.split("\n");
  const sourceLabel = promptLines.length > 1 ? promptLines[0] : null;
  const instruction = promptLines.length > 1 ? promptLines.slice(1).join("\n") : question.prompt;

  const targetRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const origin = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hoverTargetId, setHoverTargetId] = useState<string | null>(null);

  function hitTest(clientX: number, clientY: number): string | null {
    for (const [id, el] of Object.entries(targetRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return id;
      }
    }
    return null;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (locked) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    origin.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging || !origin.current) return;
    const dx = event.clientX - origin.current.x;
    const dy = event.clientY - origin.current.y;
    setOffset({ x: dx, y: dy });
    setHoverTargetId(hitTest(event.clientX, event.clientY));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    const droppedOn = hitTest(event.clientX, event.clientY);
    setDragging(false);
    setOffset({ x: 0, y: 0 });
    setHoverTargetId(null);
    origin.current = null;
    if (droppedOn) onSelect(droppedOn);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="whitespace-pre-line text-center text-2xl font-semibold leading-relaxed sm:text-3xl">
        {instruction}
      </p>
      <div className="drag-match-board">
        <button
          type="button"
          disabled={locked}
          className={cn("drag-chip", dragging && "drag-chip-dragging", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary")}
          style={dragging ? { transform: `translate(${offset.x}px, ${offset.y}px)` } : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label={sourceLabel ?? "Item"}
        >
          <span className="question-emoji text-5xl leading-none" aria-hidden>{sourceLabel}</span>
        </button>
        <div className="drag-targets" role="group" aria-label="Tempat untuk meletakkan">
          {options.map((option) => {
            const isRevealedCorrect = answered && option.id === answerState.correctOptionId;
            const isWrongSelection = answered && option.id === answerState.selectedOptionId && !answerState.isCorrect;
            return (
              <button
                key={option.id}
                type="button"
                disabled
                ref={(el) => { targetRefs.current[option.id] = el; }}
                aria-label={option.label}
                className={cn(
                  "drag-target reveal answer-option-transition",
                  hoverTargetId === option.id && "drag-target-ready",
                  answered && !isRevealedCorrect && !isWrongSelection && "opacity-40",
                  isRevealedCorrect && "celebrate drag-target-correct",
                  isWrongSelection && "shake drag-target-wrong",
                )}
              >
                <span className="question-emoji text-4xl leading-none" aria-hidden>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {!locked ? <p className="drag-hint">Seret {sourceLabel} ke kotak angka yang tepat</p> : null}
    </div>
  );
}
