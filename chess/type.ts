import { Piece } from "@/chess/piece/Piece";
import { z } from "zod";

export enum Color {
    WHITE = "WHITE",
    BLACK = "BLACK",
}

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

export enum Material {
    DEFAULT = "d",
    SAPPHIRE = "s",
    AMBER = "a",
    GLASS = "l",
    STEAL = "t",
    GOLD = "g",
    PAPER = "p",
    EMERALD = "e",
}

export enum Base {
    DEFAULT = "d",
    SAPPHIRE = "s",
    AMBER = "a",
    GLASS = "l",
}

export const PieceImage: Readonly<Record<Fen, string>> = {
    [Fen.WHITE_PAWN]: "/asset/piece/white/pawn.png",
    [Fen.WHITE_KNIGHT]: "/asset/piece/white/knight.png",
    [Fen.WHITE_BISHOP]: "/asset/piece/white/bishop.png",
    [Fen.WHITE_ROOK]: "/asset/piece/white/rook.png",
    [Fen.WHITE_QUEEN]: "/asset/piece/white/queen.png",
    [Fen.WHITE_KING]: "/asset/piece/white/king.png",
    [Fen.BLACK_PAWN]: "/asset/piece/black/pawn.png",
    [Fen.BLACK_KNIGHT]: "/asset/piece/black/knight.png",
    [Fen.BLACK_BISHOP]: "/asset/piece/black/bishop.png",
    [Fen.BLACK_ROOK]: "/asset/piece/black/rook.png",
    [Fen.BLACK_QUEEN]: "/asset/piece/black/queen.png",
    [Fen.BLACK_KING]: "/asset/piece/black/king.png",
};

export enum MoveType {
    MOVE = "MOVE",
    CAPTURE = "CAPTURE",
    CASTLE = "CASTLE",
    PROMOTE = "PROMOTE",
    CHECK = "CHECK",
    MATE = "MATE",
}

export enum GameOverReason {
    INSUFFICIENT_MATERIAL = "INSUFFICIENT_MATERIAL",
    MATE = "MATE",
    STALEMATE = "STALEMATE",
    THREE_FOLD_REPETITION = "THREE_FOLD_REPETITION",
    FIFTY_MOVE_RULE = "FIFTY_MOVE_RULE",
}

export const CoordsSchema = z.object({
    x: z.number(),
    y: z.number(),
});
export type Coords = z.infer<typeof CoordsSchema>;

export const SafeSquaresSchema = z.map(z.string(), z.array(CoordsSchema));
export type SafeSquares = z.infer<typeof SafeSquaresSchema>;

export const PieceTypeSchema = z.object({
    fen: z.nativeEnum(Fen),
    material: z.nativeEnum(Material),
    base: z.nativeEnum(Base),
    hasMoved: z.boolean().optional(),
});
export type PieceType = z.infer<typeof PieceTypeSchema>;

export const LastMoveTypeSchema = z.object({
    piece: PieceTypeSchema,
    prevX: z.number(),
    prevY: z.number(),
    currX: z.number(),
    currY: z.number(),
    moveType: z.array(z.nativeEnum(MoveType)),
});
export type LastMoveType = z.infer<typeof LastMoveTypeSchema>;

export type LastMove = {
    piece: Piece;
    prevX: number;
    prevY: number;
    currX: number;
    currY: number;
    moveType: Set<MoveType>;
};

export const KingCheckedSchema = z.object({
    isInCheck: z.literal(true),
    coords: CoordsSchema,
});

export const KingNotCheckedSchema = z.object({
    isInCheck: z.literal(false),
});

export const CheckStateSchema = z.discriminatedUnion("isInCheck", [KingCheckedSchema, KingNotCheckedSchema]);
export type CheckState = z.infer<typeof CheckStateSchema>;

export const MoveListSchema = z.array(z.tuple([z.string()]).or(z.tuple([z.string(), z.string()])));
export type MoveList = z.infer<typeof MoveListSchema>;

type GameState = {
    lastMove: LastMove | undefined;
    checkState: CheckState;
    board: (Fen | null)[][];
};
export type GameHistory = GameState[];

const GameStateTypeSchema = z.object({
    lastMove: LastMoveTypeSchema.optional(),
    checkState: CheckStateSchema,
    board: z.array(z.array(z.union([z.nativeEnum(Fen), z.null()]))),
});

export const GameHistoryTypeSchema = z.array(GameStateTypeSchema);
export type GameHistoryType = z.infer<typeof GameHistoryTypeSchema>;

export const SquareWithPieceSchema = z.object({
    piece: z.nativeEnum(Fen),
    coords: CoordsSchema,
});

export const SquareWithoutPieceSchema = z.object({
    piece: z.null(),
});

export const SelectedSquareSchema = z.discriminatedUnion("piece", [SquareWithPieceSchema, SquareWithoutPieceSchema]);
export type SelectedSquare = z.infer<typeof SelectedSquareSchema>;

export const ScoreSchema = z.object({
    from: CoordsSchema,
    to: CoordsSchema,
    score: z.number(),
    promotionPiece: z.nativeEnum(Fen).optional().nullable(),
});
export type Score = z.infer<typeof ScoreSchema>;

export const GameOverSchema = z.object({
    isGameOver: z.literal(true),
    winner: z.nativeEnum(Color).optional(),
    reason: z.nativeEnum(GameOverReason),
});
export type GameOver = z.infer<typeof GameOverSchema>;

export const BoardSchema = z.array(z.array(z.union([PieceTypeSchema, z.null()])));
export type Board = z.infer<typeof BoardSchema>;

export const SavedGameSchema = z.object({
    board: BoardSchema,
    playerColor: z.nativeEnum(Color),
    lastMove: LastMoveTypeSchema.nullable(),
    checkState: CheckStateSchema,
    fiftyMoveRuleCounter: z.number(),
    isGameOver: z.boolean(),
    gameOver: GameOverSchema.nullable(),
    fullNumberOfMoves: z.number(),
    threeFoldRepetitionDictionary: z.array(z.tuple([z.string(), z.number()])),
    threeFoldRepetitionFlag: z.boolean(),
    boardAsFEN: z.string(),
    moveList: MoveListSchema,
    gameHistory: GameHistoryTypeSchema,
});
export type SavedGame = z.infer<typeof SavedGameSchema>;
