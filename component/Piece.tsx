/* eslint-disable @next/next/no-img-element */
import { Coords, Fen, PieceImage } from "@/chess/type";

interface Props {
    fen: Fen | null;
    coords: Coords;
}

const Piece = ({ fen, coords }: Props) => {
    if (!fen) return null;

    return (
        <div
            className="pointer-events-none relative flex size-full items-center justify-center select-none"
            style={{ gridColumnStart: coords.y + 1, gridRowStart: 8 - coords.x }}
        >
            <img className="h-[70%] w-[70%]" src={PieceImage[fen]} alt={`${fen} piece`} />
        </div>
    );
};

export default Piece;
