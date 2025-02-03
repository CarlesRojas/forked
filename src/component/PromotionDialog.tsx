import { Fen, PieceImage } from "@/game/chess/type";
import { useEffect, useState } from "react";

interface Props {
    getPromotionOptions: () => Fen[];
    onPromote: (piece: Fen) => void;
    isPromotionActive: boolean;
}

const PromotionDialog = ({ getPromotionOptions, onPromote, isPromotionActive }: Props) => {
    const [promotionOptions, setPromotionOptions] = useState<Fen[]>([]);

    useEffect(() => {
        setPromotionOptions(isPromotionActive ? getPromotionOptions() : []);
    }, [getPromotionOptions, isPromotionActive]);

    if (!isPromotionActive) return null;

    return (
        <>
            <div className="pointer-events-all fixed inset-0 z-40 bg-black/50"></div>

            <div className="absolute top-0 bottom-0 left-full z-50 grid grid-cols-1 grid-rows-8 bg-red-200/40">
                {promotionOptions.map((fen) => (
                    <div
                        key={`promotion-${fen}`}
                        className="flex aspect-square h-full cursor-pointer items-center justify-center transition-transform hover:scale-110"
                        onClick={() => onPromote(fen)}
                    >
                        <div className="pointer-events-none relative flex size-full items-center justify-center">
                            <img
                                className="pointer-events-none h-[70%] w-[70%] select-none"
                                style={{ imageRendering: "pixelated" }}
                                src={PieceImage[fen]}
                                alt={`${fen} piece`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PromotionDialog;
