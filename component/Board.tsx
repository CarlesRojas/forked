"use client";

import Piece from "@/component/Piece";
import Tile from "@/component/Tile";
import { boardAtom } from "@/state/game";
import { useAtomValue } from "jotai";

const Board = () => {
    const board = useAtomValue(boardAtom);

    return (
        <main className="relative aspect-square h-full">
            <div className="grid h-full w-fit grid-cols-8 grid-rows-8">
                {Array.from({ length: 8 }).map((_, x) =>
                    Array.from({ length: 8 }).map((_, y) => <Tile key={`${x}-${y}`} coords={{ x, y }} />),
                )}
            </div>

            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8" style={{ imageRendering: "pixelated" }}>
                {board.chessBoardView.map((row, x) =>
                    row.map((fen, y) => <Piece key={`${x}-${y}`} coords={{ x, y }} fen={fen} />),
                )}
            </div>
        </main>
    );
};

export default Board;
