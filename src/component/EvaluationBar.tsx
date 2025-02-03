import { EVAL_BAR_LIMIT } from "@/game/chess/const";
import { EngineMateIn } from "@/game/chess/stockfish/StockfishEngine";
import { Color, GameOver } from "@/game/chess/type";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "usehooks-ts";

interface EvaluationBarProps {
    evaluation: number;
    mateIn?: EngineMateIn;
    gameOver?: GameOver;
}

const EvaluationBar = ({ evaluation, mateIn, gameOver }: EvaluationBarProps) => {
    const isPortrait = useMediaQuery("(orientation: portrait)");

    const clampedEval = Math.max(-EVAL_BAR_LIMIT, Math.min(EVAL_BAR_LIMIT, evaluation));
    let percentage = ((EVAL_BAR_LIMIT - clampedEval) / (2 * EVAL_BAR_LIMIT)) * 90 + 5;

    if (mateIn) percentage = mateIn.color === Color.BLACK ? 100 : 0;
    if (gameOver) percentage = gameOver.winner ? (gameOver.winner === Color.BLACK ? 100 : 0) : 50;

    return (
        <div className="bg-white-piece relative h-full w-8 portrait:h-8 portrait:w-full">
            <div
                className={cn(
                    "bg-trout-950 absolute left-0 top-0 transition-all duration-1000 portrait:left-[unset] portrait:right-0",
                )}
                style={
                    isPortrait
                        ? { width: `${percentage}%`, height: "100%" }
                        : { height: `${percentage}%`, width: "100%" }
                }
            />

            {!gameOver && (
                <p
                    className={cn(
                        "absolute left-1/2 h-fit -translate-x-1/2 text-xs portrait:left-[unset] portrait:top-1/2 portrait:-translate-y-1/2 portrait:translate-x-0",
                        !mateIn && evaluation < 0 && "top-0.5 text-white portrait:right-2 portrait:top-1/2",
                        !mateIn &&
                            evaluation >= 0 &&
                            "bottom-0.5 font-semibold text-black portrait:bottom-[unset] portrait:left-2",
                        mateIn &&
                            mateIn.color === Color.WHITE &&
                            "bottom-0.5 font-semibold text-black portrait:bottom-[unset] portrait:left-2",
                        mateIn &&
                            mateIn.color === Color.BLACK &&
                            "top-0.5 text-white portrait:right-2 portrait:top-1/2",
                    )}
                >
                    {mateIn ? `M${mateIn.moves}` : Math.abs(evaluation).toFixed(1)}
                </p>
            )}
        </div>
    );
};

export default EvaluationBar;
