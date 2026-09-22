"use client";

import { cn } from "@/lib/utils";
import type { ActivityComponentProps, ChildSafeOption } from "@/types/learning";

/**
 * SAME_AMOUNT: prompt's first line is the reference group (see
 * matchAmountQuestion in prisma/seed.ts), the rest is the instruction.
 * Presented as "this many →" next to the candidate groups, instead of a
 * plain option grid, so the comparison itself is the visual.
 */
export function SameAmountActivity({ question, answerState, onSelect, disabled }: ActivityComponentProps) {
  const options = (question.options as ChildSafeOption[] | null) ?? [];
  const answered = answerState.status === "answered";
  const locked = answered || Boolean(disabled);
  const promptLines = question.prompt.split("\n");
  const referenceGroup = promptLines.length > 1 ? promptLines[0] : null;
  const instruction = promptLines.length > 1 ? promptLines.slice(1).join("\n") : question.prompt;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="same-amount-compare">
        {referenceGroup ? (
          <div className="same-amount-reference">
            <span className="question-emoji text-5xl leading-none" aria-hidden>{referenceGroup}</span>
          </div>
        ) : null}
        <span className="same-amount-arrow" aria-hidden>=</span>
        <div className="same-amount-candidates" role="group" aria-label="Pilih kumpulan dengan jumlah yang sama">
          {options.map((option) => {
            const isRevealedCorrect = answered && option.id === answerState.correctOptionId;
            const isWrongSelection = answered && option.id === answerState.selectedOptionId && !answerState.isCorrect;
            return (
              <button
                key={option.id}
                type="button"
                disabled={locked}
                aria-label={option.label}
                onClick={() => onSelect(option.id)}
                className={cn(
                  "same-amount-card reveal answer-option-transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  !locked && "hover-scale",
                  answered && !isRevealedCorrect && !isWrongSelection && "opacity-40",
                  isRevealedCorrect && "celebrate same-amount-card-correct",
                  isWrongSelection && "shake same-amount-card-wrong",
                )}
              >
                <span className="question-emoji text-4xl leading-none" aria-hidden>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="whitespace-pre-line text-center text-2xl font-semibold leading-relaxed sm:text-3xl">
        {instruction}
      </p>
    </div>
  );
}
