import { EVAL_BAR_LIMIT } from "@/chess/const";
import { EngineMateIn } from "@/chess/stockfish/StockfishEngine";
import { Color } from "@/chess/type";
import { cn } from "@/lib/cn";

interface EvaluationBarProps {
    evaluation: number;
    mateIn?: EngineMateIn;
}

const EvaluationBar = ({ evaluation, mateIn }: EvaluationBarProps) => {
    const clampedEval = Math.max(-EVAL_BAR_LIMIT, Math.min(EVAL_BAR_LIMIT, evaluation));
    let percentage = ((EVAL_BAR_LIMIT - clampedEval) / (2 * EVAL_BAR_LIMIT)) * 95;

    if (mateIn && mateIn.color === Color.BLACK) percentage = 100;
    else if (mateIn && mateIn.color === Color.WHITE) percentage = 0;

    // TODO when it is game over show the correct eval bar

    return (
        <div className="bg-white-piece relative h-full w-8">
            <div
                className={cn("bg-black-piece absolute top-0 left-0 w-full transition-all duration-500")}
                style={{ height: `${percentage}%` }}
            />

            <p
                className={cn(
                    "absolute left-1/2 h-fit -translate-x-1/2 text-xs text-neutral-500",
                    !mateIn && evaluation < 0 && "top-0.5 text-white",
                    !mateIn && evaluation >= 0 && "bottom-0.5 text-black",
                    mateIn && mateIn.color === Color.WHITE && "bottom-0.5 text-black",
                    mateIn && mateIn.color === Color.BLACK && "top-0.5 text-white",
                )}
            >
                {mateIn ? `M${mateIn.moves}` : Math.abs(evaluation).toFixed(1)}
            </p>
        </div>
    );
};

export default EvaluationBar;
