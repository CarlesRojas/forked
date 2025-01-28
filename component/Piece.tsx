/* eslint-disable @next/next/no-img-element */
import { Coords, Fen, PieceImage } from "@/chess/type";
import { cn } from "@/lib/cn";
import { useDraggable } from "@dnd-kit/core";

interface Props {
    fen: Fen | null;
    coords: Coords;
    onPieceClicked: (coords: Coords) => void;
}

const playerPieces = [
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "relative flex size-full items-center justify-center",
                !playerPieces.includes(fen) && "pointer-events-none",
            )}
            onClick={() => onPieceClicked(coords)}
        >
            <img
                className="pointer-events-none h-[70%] w-[70%] select-none"
                style={{ imageRendering: "pixelated" }}
                src={PieceImage[fen]}
                alt={`${fen} piece`}
            />
        </div>
    );
};

export default Piece;
