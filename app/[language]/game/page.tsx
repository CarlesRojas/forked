"use client";

import EvaluationBar from "@/component/EvaluationBar";
import GameStatus from "@/component/GameStatus";
import { currentMatchAtom } from "@/state/game";
import { useAtomValue } from "jotai";

const Game = () => {
    const match = useAtomValue(currentMatchAtom);

    if (!match) return;

    return (
        <div className="relative grid h-full w-full grid-cols-[min-content_1fr_min-content] gap-4 p-6">
            <div className="relative size-full">
                <EvaluationBar evaluation={2} />
            </div>

            <div className="relative size-full bg-green-500/30" />

            <div className="relative size-full">
                <GameStatus match={match} />
            </div>
        </div>
    );
};

export default Game;
