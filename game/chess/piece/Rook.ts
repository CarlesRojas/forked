import { Piece } from "@/game/chess/piece/Piece";
import { Base, Color, Coords, Fen, Material, PieceType } from "@/game/chess/type";

export class Rook extends Piece {
    private _hasMoved: boolean = false;
    protected override _fen: Fen;
    protected override _directions: Coords[] = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
    ];

    constructor(
        private pieceColor: Color,
        private pieceMaterial: Material,
        private pieceBase: Base,
    ) {
        super(pieceColor, pieceMaterial, pieceBase);
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_ROOK : Fen.BLACK_ROOK;
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    public set hasMoved(_) {
        this._hasMoved = true;
    }

    public override clone(): Piece {
        const newRook = new Rook(this.color, this.material, this.base);
        if (this._hasMoved) newRook.hasMoved = true;
        return newRook;
    }

    public override toType(): PieceType {
        return { fen: this.fen, material: this.material, base: this.base, hasMoved: this._hasMoved };
    }

    public static fromType(piece: PieceType): Rook {
        const newRook = new Rook(piece.fen === Fen.WHITE_ROOK ? Color.WHITE : Color.BLACK, piece.material, piece.base);
        if (piece.hasMoved) newRook.hasMoved = true;
        return newRook;
    }
}
