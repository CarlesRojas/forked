import { Bishop } from "@/chess/piece/Bishop";
import { King } from "@/chess/piece/King";
import { Knight } from "@/chess/piece/Knight";
import { Pawn } from "@/chess/piece/Pawn";
import { Queen } from "@/chess/piece/Queen";
import { Rook } from "@/chess/piece/Rook";
import { Base, Color, Coords, Fen, Material, PieceType } from "@/chess/type";

export abstract class Piece {
    protected abstract _fen: Fen;
    protected abstract _directions: Coords[];

    constructor(
        private _color: Color,
        private _material: Material,
        private _base: Base,
    ) {}

    public get fen(): Fen {
        return this._fen;
    }

    public get directions(): Coords[] {
        return this._directions;
    }

    public get color(): Color {
        return this._color;
    }

    public get material(): Material {
        return this._material;
    }

    public get base(): Base {
        return this._base;
    }

    public set material(material: Material) {
        this._material = material;
    }

    public set base(base: Base) {
        this._base = base;
    }

    public abstract clone(): Piece;

    public abstract toType(): PieceType;

    public fromType(piece: PieceType): Piece {
        switch (piece.fen.toUpperCase()) {
            case Fen.WHITE_PAWN:
                const pawn = new Pawn(
                    piece.fen === Fen.WHITE_PAWN ? Color.WHITE : Color.BLACK,
                    piece.material,
                    piece.base,
                );
                if (piece.hasMoved) pawn.hasMoved = true;
                return pawn;

            case Fen.WHITE_KNIGHT:
                return new Knight(
                    piece.fen === Fen.WHITE_KNIGHT ? Color.WHITE : Color.BLACK,
                    piece.material,
                    piece.base,
                );

            case Fen.WHITE_BISHOP:
                return new Bishop(
                    piece.fen === Fen.WHITE_BISHOP ? Color.WHITE : Color.BLACK,
                    piece.material,
                    piece.base,
                );

            case Fen.WHITE_ROOK:
                const rook = new Rook(
                    piece.fen === Fen.WHITE_ROOK ? Color.WHITE : Color.BLACK,
                    piece.material,
                    piece.base,
                );
                if (piece.hasMoved) rook.hasMoved = true;
                return rook;

            case Fen.WHITE_QUEEN:
                return new Queen(piece.fen === Fen.WHITE_QUEEN ? Color.WHITE : Color.BLACK, piece.material, piece.base);

            case Fen.WHITE_KING:
                const king = new King(
                    piece.fen === Fen.WHITE_KING ? Color.WHITE : Color.BLACK,
                    piece.material,
                    piece.base,
                );
                if (piece.hasMoved) king.hasMoved = true;
                return king;

            default:
                throw new Error(`Invalid piece character: ${piece.fen}`);
        }
    }
}
