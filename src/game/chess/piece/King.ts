import { Piece } from "@/game/chess/piece/Piece";
import { Base, Color, Coords, Fen, Material, PieceType } from "@/game/chess/type";

export class King extends Piece {
    private _hasMoved: boolean = false;
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
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_KING : Fen.BLACK_KING;
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    public set hasMoved(_) {
        this._hasMoved = true;
    }

    public override clone(): Piece {
        const newKing = new King(this.color, this.material, this.base);
        if (this._hasMoved) newKing.hasMoved = true;
        return newKing;
    }

    public override toType(): PieceType {
        return { fen: this.fen, material: this.material, base: this.base, hasMoved: this._hasMoved };
    }

    public static fromType(piece: PieceType): King {
        const newKing = new King(piece.fen === Fen.WHITE_KING ? Color.WHITE : Color.BLACK, piece.material, piece.base);
        if (piece.hasMoved) newKing.hasMoved = true;
        return newKing;
    }
}
