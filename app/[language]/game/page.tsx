"use client";

import { PageProps } from "@/app/[language]/layout";
import Board from "@/component/Board";
import EvaluationBar from "@/component/EvaluationBar";
import GameStatus from "@/component/GameStatus";
import { AspectRatio } from "@/component/ui/aspect-ratio";
import { ChessBoard } from "@/game/chess/ChessBoard";
import { useStockfish } from "@/game/chess/stockfish/useStockfish";
import { currentMatchAtom, savedChessboardAtom } from "@/state/game";
import { useAtomValue } from "jotai";
import { use, useState } from "react";

const Game = ({ params }: PageProps) => {
    const { language } = use(params);
    const match = useAtomValue(currentMatchAtom);
    const savedChessBoard = useAtomValue(savedChessboardAtom);
    const [chessBoard] = useState(() => (savedChessBoard ? ChessBoard.deserialize(savedChessBoard) : new ChessBoard()));
    const { evaluate, bestMove, mateIn, evaluation, isReady } = useStockfish();

    if (!match) return;

    return (
        <div className="relative grid h-full w-full grid-cols-[min-content_minmax(0,1fr)_min-content] grid-rows-1 gap-6 p-6 portrait:grid-cols-1 portrait:grid-rows-[min-content_minmax(0,1fr)_min-content]">
            <div className="relative size-full">
                <EvaluationBar evaluation={evaluation} mateIn={mateIn} gameOver={chessBoard.gameOver} />
            </div>

            <div className="relative size-full">
                <div className="relative aspect-square max-h-full">
                    <AspectRatio ratio={1}>
                        <Board chessBoard={chessBoard} evaluation={{ evaluate, bestMove, isReady }} />
                    </AspectRatio>
                </div>
            </div>

            <div className="relative size-full">
                <GameStatus match={match} language={language} />
            </div>
        </div>
    );
};

export default Game;
