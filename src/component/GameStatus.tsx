import { Match, MoveUpgrade, PieceUpgrade } from "@/game/match/type";
import { getTranslation } from "@/locale/getTranslation";
import { Language } from "@/locale/language";
import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";

interface Props {
    match: Match;
    language: Language;
}

const GameStatus = ({ match, language }: Props) => {
    const t = getTranslation(language);

    const { rounds, currentRound, moveLevels, pieceLevels, money, maxMoves } = match;
    const currentRoundData = rounds[currentRound]!;

    const { tournament, stage, targetScore, currentScore, movesMade, reward } = currentRoundData;

    const modifierSlotRef = useRef<HTMLDivElement>(null);
    // @ts-expect-error this is ok
    const { width: modifierSlotWidth } = useResizeObserver({ ref: modifierSlotRef, box: "border-box" });

    return (
        <div className="flex h-full w-fit max-w-[30vw] flex-col justify-between gap-2 sm:min-w-96 lg:gap-4 portrait:w-full portrait:min-w-full portrait:md:grid portrait:md:h-fit portrait:md:grid-cols-2">
            <div className="flex flex-col gap-2 lg:gap-4">
                <div className="bg-trout-950 flex flex-col gap-2 p-2 lg:gap-4 lg:p-4">
                    <div className="flex flex-col">
                        <div className="flex items-baseline justify-between gap-2 lg:gap-4">
                            <h2 className="text-lg capitalize leading-4 text-orange-400 lg:text-2xl lg:leading-7">
                                {t.enum.tournament[tournament]}
                            </h2>

                            <span className="lg:text-md text-sm opacity-60">
                                {currentRound + 1}/{rounds.length}{" "}
                            </span>
                        </div>

                        <div className="lowercase leading-5">
                            <span className="lg:text-md text-sm opacity-60">{t.enum.stage[stage]} </span>
                            <span className="lg:text-md text-sm text-amber-400">
                                {t.game.status.price.replace("{{REWARD}}", reward.toLocaleString(language))}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="lg:text-md text-sm opacity-60">{t.game.status.scoreAtLeast}</div>

                        <div className="bg-trout-800 relative w-full px-2 lg:py-1">
                            <p className="text-lg text-orange-400 lg:text-3xl">
                                {targetScore.toLocaleString(language)}
                            </p>

                            <div
                                className="absolute left-0 top-0 h-full bg-orange-700/20"
                                style={{
                                    width: `${(currentScore / targetScore) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-trout-950 flex items-center gap-2 p-2 lg:gap-4 lg:p-4">
                    <div className="flex w-fit flex-col">
                        <p className="lg:text-md leading-3.5 text-sm opacity-60 lg:leading-5">
                            {t.game.status.roundScore.split(" ")[0]}
                        </p>
                        <p className="lg:text-md leading-3.5 text-sm opacity-60 lg:leading-5">
                            {t.game.status.roundScore.split(" ")[1]}
                        </p>
                    </div>

                    <div className="bg-trout-800 relative flex w-full items-center justify-center px-2 lg:py-1">
                        <p className="text-lg lg:text-3xl">{targetScore.toLocaleString(language)}</p>
                    </div>
                </div>

                <div className="bg-trout-950 flex flex-col items-center justify-center gap-2 p-2 lg:gap-4 lg:p-4">
                    <div className="flex w-fit flex-col lg:gap-1">
                        {/* TODO get piece being moved and move or last one if scoring */}
                        <span className="w-fit text-lg leading-5 text-white lg:text-2xl">
                            {t.enum.pieceUpgrade[PieceUpgrade.PAWN]} {t.enum.moveUpgrade[MoveUpgrade.MOVE]}
                        </span>

                        <div className="flex w-full justify-between gap-2">
                            <span className="text-xs leading-4 opacity-60">{`lvl ${pieceLevels[PieceUpgrade.PAWN]}`}</span>
                            <span className="text-xs leading-4 opacity-60">{`lvl ${moveLevels[MoveUpgrade.MOVE]}`}</span>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-[minmax(0,1fr)_min-content_minmax(0,1fr)] gap-2">
                        <div className="h-fit w-full bg-blue-400/50 px-2 lg:py-1">
                            <p className="w-full text-right text-lg lg:text-3xl">50</p>
                        </div>

                        <div className="flex h-full items-center justify-center">
                            <span className="text-4xl leading-4">×</span>
                        </div>

                        <div className="h-fit w-full bg-orange-400/50 px-2 lg:py-1">
                            <p className="w-full text-left text-lg lg:text-3xl">4</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-trout-950 flex h-fit w-full items-end justify-center gap-3 p-2 lg:flex-col lg:items-center lg:p-4">
                <div className="flex w-fit items-end justify-between gap-3 lg:w-full lg:items-start">
                    <div className="flex flex-col gap-1 lg:flex-row lg:gap-6">
                        <div className="flex flex-col">
                            <p className="lg:text-md text-sm leading-5 opacity-60 lg:leading-8">
                                {t.game.status.funds}
                            </p>
                            <p className="text-lg leading-4 text-amber-400 lg:text-3xl">{`$${money.toLocaleString(language)}`}</p>
                        </div>

                        <div className="flex flex-col">
                            <p className="lg:text-md text-sm leading-5 opacity-60 lg:leading-8">
                                {t.game.status.moves}
                            </p>
                            <p className="text-lg leading-4 lg:text-3xl">{maxMoves - movesMade}</p>
                        </div>
                    </div>

                    <div className="flex min-w-fit flex-col gap-1.5">
                        <div className="lg:text-md text-sm opacity-60">{t.game.status.consumables}</div>
                        <div className="grid w-fit grid-cols-2 gap-1 lg:gap-2">
                            <div
                                className="bg-trout-800 aspect-square size-full"
                                style={{ width: modifierSlotWidth }}
                            ></div>
                            <div
                                className="bg-trout-800 aspect-square size-full"
                                style={{ width: modifierSlotWidth }}
                            ></div>
                            {/* TODO make this same side as modifiers */}
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-1.5">
                    <div className="lg:text-md text-sm opacity-60">{t.game.status.modifiers}</div>

                    <div className="grid w-full grid-cols-5 gap-1 lg:gap-2">
                        <div className="bg-trout-800 aspect-square size-full" ref={modifierSlotRef}></div>
                        <div className="bg-trout-800 aspect-square size-full"></div>
                        <div className="bg-trout-800 aspect-square size-full"></div>
                        <div className="bg-trout-800 aspect-square size-full"></div>
                        <div className="bg-trout-800 aspect-square size-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameStatus;
