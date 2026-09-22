import { CountSelectActivity } from "@/components/activities/CountSelectActivity";
import { MultipleChoiceActivity } from "@/components/activities/MultipleChoiceActivity";
import { NumberRecognitionActivity } from "@/components/activities/NumberRecognitionActivity";
import { NumberInputActivity } from "@/components/activities/NumberInputActivity";
import { CircleSelectActivity } from "@/components/activities/CircleSelectActivity";
import { SameAmountActivity } from "@/components/activities/SameAmountActivity";
import { TraceNumberActivity } from "@/components/activities/TraceNumberActivity";
import { DragMatchActivity } from "@/components/activities/DragMatchActivity";
import type { ActivityComponentProps } from "@/types/learning";

/** Selects the right activity component for a question's activity type. */
export function ActivityRenderer(props: ActivityComponentProps) {
  switch (props.question.activityType) {
    case "MULTIPLE_CHOICE":
      return <MultipleChoiceActivity {...props} />;
    case "NUMBER_RECOGNITION":
      return <NumberRecognitionActivity {...props} />;
    case "COUNT_INPUT":
      return <NumberInputActivity {...props} />;
    case "COUNT_CIRCLE":
      return <CircleSelectActivity {...props} />;
    case "SAME_AMOUNT":
      return <SameAmountActivity {...props} />;
    case "TRACE_NUMBER":
      return <TraceNumberActivity {...props} />;
    case "DRAG_MATCH":
      return <DragMatchActivity {...props} />;
    case "COUNT_SELECT":
    default:
      return <CountSelectActivity {...props} />;
  }
}
