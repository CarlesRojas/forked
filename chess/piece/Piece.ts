import { Color, Coords, Fen } from "@/chess/type";

export abstract class Piece {
    protected abstract _fen: Fen;
    protected abstract _directions: Coords[];

    constructor(private _color: Color) {}

    public get fen(): Fen {
        return this._fen;
    }

    public get directions(): Coords[] {
        return this._directions;
    }

    public get color(): Color {
        return this._color;
    }
}
