import { Piece } from "@/chess/piece/Piece";
import { Color, Coords, Fen } from "@/chess/type";

export class Bishop extends Piece {
    protected override _fen: Fen;
    protected override _directions: Coords[] = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
    ];

    constructor(private pieceColor: Color) {
        super(pieceColor);
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_BISHOP : Fen.BLACK_BISHOP;
    }

    public override clone(): Piece {
        return new Bishop(this.color);
    }
}
