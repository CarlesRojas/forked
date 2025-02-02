import { Match, MoveUpgrade, PieceUpgrade } from "@/game/match/type";
import { getTranslation } from "@/locale/getTranslation";
import { Language } from "@/locale/language";

interface Props {
    match: Match;
    language: Language;
}

const GameStatus = ({ match, language }: Props) => {
    const t = getTranslation(language);

    const { rounds, currentRound, moveLevels, pieceLevels, money, maxMoves } = match;
    const currentRoundData = rounds[currentRound]!;

    const { tournament, stage, targetScore, currentScore, movesMade, reward } = currentRoundData;

    return (
        <div className="flex h-full w-fit min-w-96 flex-col justify-between">
            <div className="flex flex-col gap-4">
                <div className="bg-trout-950 flex flex-col gap-4 p-4">
                    <div className="flex flex-col">
                        <div className="flex items-baseline justify-between gap-4">
                            <h2 className="text-2xl leading-7 text-orange-400 capitalize">
                                {t.enum.tournament[tournament]}
                            </h2>

                            <span className="opacity-60">
                                {currentRound + 1}/{rounds.length}{" "}
                            </span>
                        </div>

                        <div className="leading-5 lowercase">
                            <span className="opacity-60">{t.enum.stage[stage]} </span>
                            <span className="text-amber-400">
                                {t.game.status.price.replace("{{REWARD}}", reward.toLocaleString(language))}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="opacity-60">{t.game.status.scoreAtLeast}</div>

                        <div className="bg-trout-800 relative w-full px-2 py-1">
                            <p className="text-3xl text-orange-400">{targetScore.toLocaleString(language)}</p>

                            <div
                                className="absolute top-0 left-0 h-full bg-orange-700/20"
                                style={{
                                    width: `${(currentScore / targetScore) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-trout-950 flex items-center gap-4 p-4">
                    <div className="flex w-fit flex-col">
                        <p className="leading-5 opacity-60">{t.game.status.roundScore.split(" ")[0]}</p>
                        <p className="leading-5 opacity-60">{t.game.status.roundScore.split(" ")[1]}</p>
                    </div>

                    <div className="bg-trout-800 relative flex w-full items-center justify-center px-2 py-1">
                        <p className="text-3xl">{targetScore.toLocaleString(language)}</p>
                    </div>
                </div>

                <div className="bg-trout-950 flex flex-col items-center justify-center gap-4 p-4">
                    <div className="flex w-fit flex-col gap-1">
                        {/* TODO get piece being moved and move or last one if scoring */}
                        <span className="w-fit text-2xl leading-5 text-white">
                            {t.enum.pieceUpgrade[PieceUpgrade.PAWN]} {t.enum.moveUpgrade[MoveUpgrade.MOVE]}
                        </span>

                        <div className="flex w-full justify-between gap-2">
                            <span className="text-xs leading-4 opacity-60">{`lvl ${pieceLevels[PieceUpgrade.PAWN]}`}</span>
                            <span className="text-xs leading-4 opacity-60">{`lvl ${moveLevels[MoveUpgrade.MOVE]}`}</span>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-[minmax(0,1fr)_min-content_minmax(0,1fr)] gap-2">
                        <div className="w-full bg-blue-400/50 px-2 py-1">
                            <p className="w-full text-right text-3xl">50</p>
                        </div>

                        <div className="flex h-full items-center justify-center">
                            <span className="text-4xl">×</span>
                        </div>

                        <div className="w-full bg-orange-400/50 px-2 py-1">
                            <p className="w-full text-left text-3xl">4</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-trout-950 flex w-full flex-col items-center justify-center gap-2 p-4">
                <div className="flex w-full justify-between gap-4">
                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <p className="opacity-60">{t.game.status.funds}</p>
                            <p className="text-3xl text-amber-400">{`$${money.toLocaleString(language)}`}</p>
                        </div>

                        <div className="flex flex-col">
                            <p className="opacity-60">{t.game.status.moves}</p>
                            <p className="text-3xl">{maxMoves - movesMade}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="opacity-60">{t.game.status.consumables}</div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-trout-800 h-20 w-20"></div>
                            <div className="bg-trout-800 h-20 w-20"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="opacity-60">{t.game.status.modifiers}</div>

                    <div className="grid min-w-fit grid-cols-[repeat(5,5rem)] gap-2">
                        <div className="bg-trout-800 h-20 w-20"></div>
                        <div className="bg-trout-800 h-20 w-20"></div>
                        <div className="bg-trout-800 h-20 w-20"></div>
                        <div className="bg-trout-800 h-20 w-20"></div>
                        <div className="bg-trout-800 h-20 w-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameStatus;
