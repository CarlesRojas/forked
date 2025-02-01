import { Piece } from "@/game/chess/piece/Piece";
import { Base, Color, Coords, Fen, Material, PieceType } from "@/game/chess/type";

export class Bishop extends Piece {
    protected override _fen: Fen;
    protected override _directions: Coords[] = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
    ];

    constructor(
        private pieceColor: Color,
        private pieceMaterial: Material,
        private pieceBase: Base,
    ) {
        super(pieceColor, pieceMaterial, pieceBase);
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_BISHOP : Fen.BLACK_BISHOP;
    }

    public override clone(): Piece {
        return new Bishop(this.color, this.material, this.base);
    }

    public override toType(): PieceType {
        return { fen: this.fen, material: this.material, base: this.base };
    }

    public static fromType(piece: PieceType): Bishop {
        return new Bishop(piece.fen === Fen.WHITE_BISHOP ? Color.WHITE : Color.BLACK, piece.material, piece.base);
    }
}
