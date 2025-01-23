import { Piece } from "@/chess/piece/Piece";
import { Color, Coords, Fen } from "@/chess/type";

export class Knight extends Piece {
    protected override _fen: Fen;
    protected override _directions: Coords[] = [
        { x: 1, y: 2 },
        { x: 1, y: -2 },
        { x: -1, y: 2 },
        { x: -1, y: -2 },
        { x: 2, y: 1 },
        { x: 2, y: -1 },
        { x: -2, y: 1 },
        { x: -2, y: -1 },
    ];

    constructor(private pieceColor: Color) {
        super(pieceColor);
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_KNIGHT : Fen.BLACK_KNIGHT;
    }

    public override clone(): Piece {
        return new Knight(this.color);
    }
}
