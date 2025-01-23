import { Piece } from "@/chess/piece/Piece";
import { Color, Coords, Fen } from "@/chess/type";

export class Rook extends Piece {
    private _hasMoved: boolean = false;
    protected override _fen: Fen;
    protected override _directions: Coords[] = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
    ];

    constructor(private pieceColor: Color) {
        super(pieceColor);
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_ROOK : Fen.BLACK_ROOK;
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    public set hasMoved(_) {
        this._hasMoved = true;
    }

    public override clone(): Piece {
        const newRook = new Rook(this.color);
        if (this._hasMoved) newRook.hasMoved = true;
        return newRook;
    }
}
