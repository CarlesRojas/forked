/* eslint-disable @next/next/no-img-element */
import { Coords, Fen, PieceImage } from "@/chess/type";
import { cn } from "@/lib/cn";
import { useDraggable } from "@dnd-kit/core";

interface Props {
    fen: Fen | null;
    coords: Coords;
    onPieceClicked: (coords: Coords) => void;
}

export const playerPieces = [
    Fen.WHITE_PAWN,
    Fen.WHITE_ROOK,
    Fen.WHITE_KNIGHT,
    Fen.WHITE_BISHOP,
    Fen.WHITE_QUEEN,
    Fen.WHITE_KING,
];

const Piece = ({ fen, coords, onPieceClicked }: Props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: JSON.stringify(coords),
        disabled: !fen,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    if (!fen) return <div className="h-full w-full" onClick={() => onPieceClicked(coords)} />;

    if (!playerPieces.includes(fen))
        return (
            <div className="relative flex size-full items-center justify-center" onClick={() => onPieceClicked(coords)}>
                <img
                    className="pointer-events-none h-[70%] w-[70%] select-none"
                    src={PieceImage[fen]}
                    alt={`${fen} piece`}
                />
            </div>
        );

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="group relative flex size-full items-center justify-center"
            onClick={() => onPieceClicked(coords)}
        >
            <img
                className={cn("pointer-events-none h-[70%] w-[70%] select-none", !transform && "group-hover:scale-105")}
                src={PieceImage[fen]}
                alt={`${fen} piece`}
            />
        </div>
    );
};

export default Piece;
