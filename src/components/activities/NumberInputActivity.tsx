"use client";

import { cn } from "@/lib/utils";
import type { ActivityComponentProps, ChildSafeOption } from "@/types/learning";

/**
 * COUNT_INPUT: same option/correctAnswer data shape as OptionChoiceActivity
 * (see prisma/seed.ts), but presented as a numeric keypad — options sorted
 * ascending and styled like number keys — so it *feels* like "type the
 * count" rather than "pick a labeled card". Scoring is unchanged: tapping a
 * key calls onSelect(option.id) exactly like the option-choice renderer.
 */
export function NumberInputActivity({ question, answerState, onSelect, disabled }: ActivityComponentProps) {
  const options = ((question.options as ChildSafeOption[] | null) ?? [])
    .slice()
    .sort((a, b) => Number(a.label) - Number(b.label));
  const answered = answerState.status === "answered";
  const locked = answered || Boolean(disabled);
  const promptLines = question.prompt.split("\n");
  const visualText = promptLines.length > 1 ? promptLines[0] : null;
  const instruction = promptLines.length > 1 ? promptLines.slice(1).join("\n") : question.prompt;

  return (
    <div className="flex flex-col items-center gap-8">
      {visualText ? (
        <div className="question-visual flex min-h-36 w-full items-center justify-center rounded-3xl border-2 border-accent/60 bg-accent/10 p-5 text-center">
          <span className="question-emoji text-6xl leading-none" aria-hidden>{visualText}</span>
        </div>
      ) : null}
      <p className="whitespace-pre-line text-center text-2xl font-semibold leading-relaxed sm:text-3xl">
        {instruction}
      </p>
      <div className="number-keypad" role="group" aria-label="Ketik jumlahnya">
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
                "number-key reveal answer-option-transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                !locked && "hover-scale",
                answered && !isRevealedCorrect && !isWrongSelection && "opacity-40",
                isRevealedCorrect && "celebrate number-key-correct",
                isWrongSelection && "shake number-key-wrong",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
