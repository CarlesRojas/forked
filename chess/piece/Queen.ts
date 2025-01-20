import { Piece } from "@/chess/piece/Piece";
import { Color, Coords, Fen } from "@/chess/type";

export class Queen extends Piece {
    protected override _fen: Fen;
    protected override _directions: Coords[] = [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: -1, y: 0 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
    ];

    constructor(private pieceColor: Color) {
        super(pieceColor);
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_QUEEN : Fen.BLACK_QUEEN;
    }
}
