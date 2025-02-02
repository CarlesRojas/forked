"use client";

import { PageProps } from "@/app/[language]/layout";
import { Button } from "@/component/ui/button";
import { ChessBoard } from "@/game/chess/ChessBoard";
import { createNewMatch } from "@/game/match/util";
import { getTranslation } from "@/locale/getTranslation";
import { currentMatchAtom, savedChessboardAtom } from "@/state/game";
import { useAtom, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

const MainMenu = ({ params }: PageProps) => {
    const { language } = use(params);
    const t = getTranslation(language);
    const router = useRouter();

    const [currentMatch, setCurrentMatch] = useAtom(currentMatchAtom);
    const setSavedChessBoard = useSetAtom(savedChessboardAtom);

    const handleNewGame = () => {
        setCurrentMatch(createNewMatch());
        setSavedChessBoard(new ChessBoard().serialize());
        router.push("/game");
    };

    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 p-6">
            <h1 className="text-6xl font-semibold">{t.mainMenu.title}</h1>

            <div className="flex gap-4">
                <Button onClick={handleNewGame}>{currentMatch ? t.mainMenu.newGame : t.mainMenu.play}</Button>

                {currentMatch && (
                    <Button asChild variant="secondary">
                        <Link href={"/game"}>{t.mainMenu.continue}</Link>
                    </Button>
                )}
            </div>
        </div>
    );
};

export default MainMenu;
