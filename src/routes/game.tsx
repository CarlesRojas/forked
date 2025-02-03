import Board from "@/component/Board";
import EvaluationBar from "@/component/EvaluationBar";
import GameStatus from "@/component/GameStatus";
import { AspectRatio } from "@/component/ui/aspect-ratio";
import { ChessBoard } from "@/game/chess/ChessBoard";
import { useStockfish } from "@/game/chess/stockfish/useStockfish";
import { Language } from "@/locale/language";
import { currentMatchAtom, savedChessboardAtom } from "@/state/game";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { useMediaQuery, useResizeObserver } from "usehooks-ts";

const Game = () => {
    const match = useAtomValue(currentMatchAtom);
    const savedChessBoard = useAtomValue(savedChessboardAtom);
    const [chessBoard] = useState(() => (savedChessBoard ? ChessBoard.deserialize(savedChessBoard) : new ChessBoard()));
    const { evaluate, bestMove, mateIn, evaluation, isReady } = useStockfish();
    const isPortrait = useMediaQuery("(orientation: portrait)");

    const chessBoardRef = useRef<HTMLDivElement>(null);
    // @ts-expect-error this is ok
    const chessBoardSize = useResizeObserver({ ref: chessBoardRef, box: "border-box" });

    if (!match) return;

    return (
        <div className="relative grid h-fit max-h-full w-full grid-cols-[auto_1fr_auto] grid-rows-1 gap-3 p-3 lg:gap-6 lg:p-6 portrait:h-full portrait:grid-cols-1 portrait:grid-rows-[auto_1fr_auto]">
            <div
                className="relative size-full"
                style={{ maxHeight: chessBoardSize.height, maxWidth: chessBoardSize.width }}
            >
                <EvaluationBar evaluation={evaluation} mateIn={mateIn} gameOver={chessBoard.gameOver} />
            </div>

            <div className="relative h-full w-full portrait:h-0 portrait:min-h-full">
                <div
                    className="relative aspect-square max-h-full portrait:h-full portrait:max-h-[unset] portrait:max-w-full"
                    ref={chessBoardRef}
                >
                    <AspectRatio ratio={1}>
                        <Board chessBoard={chessBoard} evaluation={{ evaluate, bestMove, isReady }} />
                    </AspectRatio>
                </div>
            </div>

            <div
                className="relative size-full"
                style={isPortrait ? { maxWidth: chessBoardSize.width } : { maxHeight: chessBoardSize.height }}
            >
                <GameStatus match={match} language={Language.EN} />
            </div>
        </div>
    );
};

export const Route = createFileRoute("/game")({
    component: Game,
});
