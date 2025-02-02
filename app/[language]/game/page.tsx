"use client";

import { PageProps } from "@/app/[language]/layout";
import Board from "@/component/Board";
import EvaluationBar from "@/component/EvaluationBar";
import GameStatus from "@/component/GameStatus";
import { AspectRatio } from "@/component/ui/aspect-ratio";
import { currentMatchAtom } from "@/state/game";
import { useAtomValue } from "jotai";
import { use } from "react";

const Game = ({ params }: PageProps) => {
    const { language } = use(params);
    const match = useAtomValue(currentMatchAtom);

    if (!match) return;

    return (
        <div className="relative grid h-full w-full grid-cols-[min-content_1fr_min-content] gap-4 p-6 portrait:grid-cols-1 portrait:grid-rows-[min-content_1fr_min-content]">
            <div className="relative size-full">
                <EvaluationBar evaluation={-2} />
            </div>

            <div className="relative size-full bg-green-500/30">
                <AspectRatio ratio={1} className="w-full portrait:h-full portrait:w-fit">
                    <Board />
                </AspectRatio>
            </div>

            <div className="relative size-full">
                <GameStatus match={match} language={language} />
            </div>
        </div>
    );
};

export default Game;
