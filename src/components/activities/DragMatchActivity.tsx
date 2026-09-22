"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ActivityComponentProps, ChildSafeOption } from "@/types/learning";

/**
 * DRAG_MATCH: same option/correctAnswer shape as OptionChoiceActivity —
 * prompt's first line is the item to match, options are the drop targets.
 * Interaction is "tap to pick up, tap a target to place" rather than
 * native HTML5 drag-and-drop, which doesn't work reliably on touch
 * screens without extra polyfills. Placing on the wrong target still
 * calls onSelect (and submits) exactly like every other activity type.
 */
export function DragMatchActivity({ question, answerState, onSelect, disabled }: ActivityComponentProps) {
  const options = (question.options as ChildSafeOption[] | null) ?? [];
  const answered = answerState.status === "answered";
  const locked = answered || Boolean(disabled);
  const promptLines = question.prompt.split("\n");
  const sourceLabel = promptLines.length > 1 ? promptLines[0] : null;
  const instruction = promptLines.length > 1 ? promptLines.slice(1).join("\n") : question.prompt;
  const [pickedUp, setPickedUp] = useState(false);

  function place(optionId: string) {
    if (locked) return;
    if (!pickedUp) {
      setPickedUp(true);
      return;
    }
    setPickedUp(false);
    onSelect(optionId);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="whitespace-pre-line text-center text-2xl font-semibold leading-relaxed sm:text-3xl">
        {instruction}
      </p>
      <div className="drag-match-board">
        <button
          type="button"
          disabled={locked}
          className={cn("drag-chip", pickedUp && "drag-chip-picked", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary")}
          onClick={() => !locked && setPickedUp((value) => !value)}
          aria-label={sourceLabel ?? "Item"}
          aria-pressed={pickedUp}
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
                disabled={locked}
                aria-label={option.label}
                onClick={() => place(option.id)}
                className={cn(
                  "drag-target reveal answer-option-transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  !locked && pickedUp && "drag-target-ready",
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
    </div>
  );
}
