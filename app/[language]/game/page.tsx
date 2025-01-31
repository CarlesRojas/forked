"use client";

import { ChessBoard } from "@/chess/ChessBoard";
import Board from "@/component/Board";
import { savedChessboardAtom } from "@/state/game";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

const Game = () => {
    const savedChessboard = useAtomValue(savedChessboardAtom);

    const [chessBoard, setChessBoard] = useState<ChessBoard>();
    useEffect(() => {
        if (chessBoard) return;

        console.log("SET CHESSBOARD");

        if (savedChessboard) setChessBoard(ChessBoard.deserialize(savedChessboard));
        else setChessBoard(new ChessBoard());
    }, [savedChessboard, chessBoard]);

    return <div className="relative h-full w-full p-6">{chessBoard && <Board chessBoard={chessBoard} />}</div>;
};

export default Game;
