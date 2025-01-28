import { COLUMNS, ROWS } from "@/chess/const";
import { Coords } from "@/chess/type";
import { cn } from "@/lib/cn";
import { useDroppable } from "@dnd-kit/core";

interface Props {
    coords: Coords;
    isSquareDark: (coords: Coords) => boolean;
    isSquareSelected: (coords: Coords) => boolean;
    isSquareMoveForSelectedPiece: (coords: Coords) => boolean;
    isSquareCaptureForSelectedPiece: (coords: Coords) => boolean;
    isSquareLastMove: (coords: Coords) => boolean;
    isSquareChecked: (coords: Coords) => boolean;
    isSquarePromotionSquare: (coords: Coords) => boolean;
    onTileClicked: (coords: Coords) => void;
}

const Tile = ({
    coords,
    isSquareDark,
    isSquareSelected,
    isSquareLastMove,
    isSquareMoveForSelectedPiece,
    isSquareCaptureForSelectedPiece,
    isSquareChecked,
    onTileClicked,
}: Props) => {
    const { setNodeRef } = useDroppable({ id: JSON.stringify(coords) });

    const isDark = isSquareDark(coords);
    const color = cn(
        isDark ? "bg-black-square" : "bg-white-square",
        isSquareSelected(coords) && isDark && "bg-black-blue-square",
        isSquareSelected(coords) && !isDark && "bg-white-blue-square",
        isSquareLastMove(coords) && isDark && "bg-black-green-square",
        isSquareLastMove(coords) && !isDark && "bg-white-green-square",
        isSquareChecked(coords) && isDark && "bg-black-red-square",
        isSquareChecked(coords) && !isDark && "bg-white-red-square",
    );

    return (
        <div
            ref={setNodeRef}
            className={cn("relative flex aspect-square size-full items-center justify-center", color)}
            style={{ gridColumnStart: coords.y + 1, gridRowStart: 8 - coords.x }}
            onClick={() => onTileClicked(coords)}
        >
            {isSquareCaptureForSelectedPiece(coords) ? (
                <div className="pointer-events-none flex size-full items-center justify-center rounded-full bg-black/15 select-none">
                    <div className={cn("size-5/6 rounded-full", color)} />
                </div>
            ) : (
                isSquareMoveForSelectedPiece(coords) && (
                    <div className="pointer-events-none size-1/4 rounded-full bg-black/15 select-none" />
                )
            )}

            <p className="pointer-events-none absolute right-1 bottom-1 text-sm font-bold tracking-widest text-black/30 select-none">{`${COLUMNS[coords.y]}${ROWS[coords.x]}`}</p>
        </div>
    );
};

export default Tile;
