import { Button } from "@/component/ui/button";
import { ChessBoard } from "@/game/chess/ChessBoard";
import { createNewMatch } from "@/game/match/util";
import { getTranslation } from "@/locale/getTranslation";
import { Language } from "@/locale/language";
import { currentMatchAtom, savedChessboardAtom } from "@/state/game";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useAtom, useSetAtom } from "jotai";

const MainMenu = () => {
    const t = getTranslation(Language.EN);
    const router = useRouter();

    const [currentMatch, setCurrentMatch] = useAtom(currentMatchAtom);
    const setSavedChessBoard = useSetAtom(savedChessboardAtom);

    const handleNewGame = () => {
        setCurrentMatch(createNewMatch());
        setSavedChessBoard(new ChessBoard().serialize());
        router.navigate({ to: "/game" });
    };

    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 p-6">
            <h1 className="text-6xl font-semibold">{t.mainMenu.title}</h1>

            <div className="flex gap-4">
                <Button onClick={handleNewGame}>{currentMatch ? t.mainMenu.newGame : t.mainMenu.play}</Button>

                {currentMatch && (
                    <Button asChild variant="secondary">
                        <Link to={"/game"}>{t.mainMenu.continue}</Link>
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Display Mode</h2>
                <div className="flex gap-4">
                    <Button onClick={async () => await window.electronAPI.setWindowMode("windowed")}>Windowed</Button>
                    <Button onClick={async () => await window.electronAPI.setWindowMode("borderless")}>
                        Borderless
                    </Button>
                    <Button onClick={async () => await window.electronAPI.setWindowMode("fullscreen")}>
                        Fullscreen
                    </Button>
                </div>
            </div>
        </div>
    );
};

export const Route = createFileRoute("/")({
    component: MainMenu,
});
