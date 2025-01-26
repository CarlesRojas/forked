import { cn } from "@/lib/cn";

interface EvaluationBarProps {
    evaluation: number;
}

const EvaluationBar = ({ evaluation }: EvaluationBarProps) => {
    const clampedEval = Math.max(-9, Math.min(9, evaluation));
    const percentage = ((9 - clampedEval) / 18) * 100;

    return (
        <div className="bg-white-piece relative h-full w-8">
            <div
                className={cn("bg-black-piece absolute top-0 left-0 w-full transition-all duration-500")}
                style={{ height: `${percentage}%` }}
            />

            <p
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 text-xs text-neutral-500",
                    evaluation > 0 && "bottom-0.5 text-black",
                    evaluation < 0 && "top-0.5 text-white",
                    evaluation === 0 && "hidden",
                )}
            >
                {Math.abs(evaluation).toFixed(1)}
            </p>
        </div>
    );
};

export default EvaluationBar;
