import { Fen } from "@/chess/type";
import Piece from "@/component/Piece";
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
            <div className="pointer-events-all fixed inset-0 z-40 bg-black/40"></div>
            <div className="absolute top-0 bottom-0 left-full z-50 grid grid-cols-1 grid-rows-8 bg-red-200/40">
                {promotionOptions.map((fen) => (
                    <div
                        key={`promotion-${fen}`}
                        className="mouse:hover:scale-110 flex aspect-square h-full cursor-pointer items-center justify-center transition-transform"
                        onClick={() => onPromote(fen)}
                    >
                        <Piece coords={{ x: 0, y: 0 }} fen={fen} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default PromotionDialog;
