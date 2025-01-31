import { Piece } from "@/chess/piece/Piece";
import { Base, Color, Coords, Fen, Material, PieceType } from "@/chess/type";

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

    constructor(
        private pieceColor: Color,
        private pieceMaterial: Material,
        private pieceBase: Base,
    ) {
        super(pieceColor, pieceMaterial, pieceBase);
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_QUEEN : Fen.BLACK_QUEEN;
    }

    public override clone(): Piece {
        return new Queen(this.color, this.material, this.base);
    }

    public override toType(): PieceType {
        return { fen: this.fen, material: this.material, base: this.base };
    }
}
