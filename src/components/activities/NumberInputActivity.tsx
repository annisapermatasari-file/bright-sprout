"use client";

import { cn } from "@/lib/utils";
import type { ActivityComponentProps } from "@/types/learning";

// Full 0-10 keypad regardless of the seeded distractor set — tapping a
// digit builds the feel of "typing" a number rather than "picking" one of
// a few offered choices. Correctness still resolves the exact same way as
// every other activity: onSelect(digit) is compared to the question's
// correctAnswer.optionId server-side, so the seeded correct option's id
// must equal the numeral string itself (see prisma/seed.ts's
// countInputQuestion, which sets id/label to String(count)).
const KEYPAD_DIGITS = Array.from({ length: 11 }, (_, i) => String(i));

export function NumberInputActivity({ question, answerState, onSelect, disabled }: ActivityComponentProps) {
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
        {KEYPAD_DIGITS.map((digit) => {
          const isRevealedCorrect = answered && digit === answerState.correctOptionId;
          const isWrongSelection = answered && digit === answerState.selectedOptionId && !answerState.isCorrect;
          return (
            <button
              key={digit}
              type="button"
              disabled={locked}
              aria-label={digit}
              onClick={() => onSelect(digit)}
              className={cn(
                "number-key reveal answer-option-transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                !locked && "hover-scale",
                answered && !isRevealedCorrect && !isWrongSelection && "opacity-40",
                isRevealedCorrect && "celebrate number-key-correct",
                isWrongSelection && "shake number-key-wrong",
              )}
            >
              {digit}
            </button>
          );
        })}
      </div>
    </div>
  );
}
