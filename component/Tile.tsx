import { Coords } from "@/chess/type";
import { cn } from "@/lib/cn";

interface Props {
    coords: Coords;
}

const Tile = ({ coords }: Props) => {
    return (
        <div
            className={cn(
                "flex aspect-square size-full items-end justify-end p-[5%]",
                coords.x % 2 === coords.y % 2 ? "bg-white-square" : "bg-black-square",
            )}
            style={{ gridColumnStart: coords.y + 1, gridRowStart: 8 - coords.x }}
        />
    );
};

export default Tile;
