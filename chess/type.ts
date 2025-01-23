import { Piece } from "@/chess/piece/Piece";

export enum Color {
    WHITE = "WHITE",
    BLACK = "BLACK",
}

export type Coords = {
    x: number;
    y: number;
};

export enum Fen {
    WHITE_PAWN = "P",
    WHITE_KNIGHT = "N",
    WHITE_BISHOP = "B",
    WHITE_ROOK = "R",
    WHITE_QUEEN = "Q",
    WHITE_KING = "K",
    BLACK_PAWN = "p",
    BLACK_KNIGHT = "n",
    BLACK_BISHOP = "b",
    BLACK_ROOK = "r",
    BLACK_QUEEN = "q",
    BLACK_KING = "k",
}

export const PieceImage: Readonly<Record<Fen, string>> = {
    [Fen.WHITE_PAWN]: "asset/piece/white/pawn.png",
    [Fen.WHITE_KNIGHT]: "asset/piece/white/knight.png",
    [Fen.WHITE_BISHOP]: "asset/piece/white/bishop.png",
    [Fen.WHITE_ROOK]: "asset/piece/white/rook.png",
    [Fen.WHITE_QUEEN]: "asset/piece/white/queen.png",
    [Fen.WHITE_KING]: "asset/piece/white/king.png",
    [Fen.BLACK_PAWN]: "asset/piece/black/pawn.png",
    [Fen.BLACK_KNIGHT]: "asset/piece/black/knight.png",
    [Fen.BLACK_BISHOP]: "asset/piece/black/bishop.png",
    [Fen.BLACK_ROOK]: "asset/piece/black/rook.png",
    [Fen.BLACK_QUEEN]: "asset/piece/black/queen.png",
    [Fen.BLACK_KING]: "asset/piece/black/king.png",
};

export type SafeSquares = Map<string, Coords[]>;

export enum MoveType {
    MOVE = "MOVE",
    CAPTURE = "CAPTURE",
    CASTLE = "CASTLE",
    PROMOTE = "PROMOTE",
    CHECK = "CHECK",
    MATE = "MATE",
}

export type LastMove = {
    piece: Piece;
    prevX: number;
    prevY: number;
    currX: number;
    currY: number;
    moveType: Set<MoveType>;
};

type KingChecked = {
    isInCheck: true;
    coords: Coords;
};

type KingNotChecked = {
    isInCheck: false;
};

export type CheckState = KingChecked | KingNotChecked;

export type MoveList = [string, string?][];

type GameState = {
    lastMove: LastMove | undefined;
    checkState: CheckState;
    board: (Fen | null)[][];
};

export type GameHistory = GameState[];

type SquareWithPiece = {
    piece: Fen;
    coords: Coords;
};

type SquareWithoutPiece = {
    piece: null;
};

export type SelectedSquare = SquareWithPiece | SquareWithoutPiece;

export interface Score {
    from: Coords;
    to: Coords;
    score: number;
}
