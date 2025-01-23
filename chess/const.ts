import { Fen } from "@/chess/type";

export const COLUMNS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export enum EngineDifficulty {
    EASY = 0,
    MEDIUM = 1,
    HARD = 2,
    EXPERT = 3,
    MASTER = 4,
    GRANDMASTER = 5,
}

export enum DepthType {
    BASE = "BASE",
    EXTENDED = "EXTENDED",
}

export const EngineDepthByDifficulty: Record<DepthType, Record<EngineDifficulty, number>> = {
    [DepthType.BASE]: {
        [EngineDifficulty.EASY]: 1,
        [EngineDifficulty.MEDIUM]: 2,
        [EngineDifficulty.HARD]: 2,
        [EngineDifficulty.EXPERT]: 3,
        [EngineDifficulty.MASTER]: 3,
        [EngineDifficulty.GRANDMASTER]: 4,
    },
    [DepthType.EXTENDED]: {
        [EngineDifficulty.EASY]: 2,
        [EngineDifficulty.MEDIUM]: 2,
        [EngineDifficulty.HARD]: 4,
        [EngineDifficulty.EXPERT]: 4,
        [EngineDifficulty.MASTER]: 5,
        [EngineDifficulty.GRANDMASTER]: 5,
    },
};

export const PieceValue: Record<Fen, number> = {
    [Fen.WHITE_PAWN]: 100,
    [Fen.WHITE_KNIGHT]: 320,
    [Fen.WHITE_BISHOP]: 330,
    [Fen.WHITE_ROOK]: 500,
    [Fen.WHITE_QUEEN]: 900,
    [Fen.WHITE_KING]: 20000,
    [Fen.BLACK_PAWN]: 100,
    [Fen.BLACK_KNIGHT]: 320,
    [Fen.BLACK_BISHOP]: 330,
    [Fen.BLACK_ROOK]: 500,
    [Fen.BLACK_QUEEN]: 900,
    [Fen.BLACK_KING]: 20000,
};

export const PawnScoreMod: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

export const KnightScoreMod: number[][] = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
];

export const BishopScoreMod: number[][] = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
];

export const RookScoreMod: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
];

export const QueenScoreMod: number[][] = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
];

export const KingScoreMod: number[][] = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
];

export const KingLateScoreMod: number[][] = [
    [-50, -40, -30, -20, -20, -30, -40, -50],
    [-30, -20, -10, 0, 0, -10, -20, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 30, 40, 40, 30, -10, -30],
    [-30, -10, 20, 30, 30, 20, -10, -30],
    [-30, -30, 0, 0, 0, 0, -30, -30],
    [-50, -30, -30, -30, -30, -30, -30, -50],
];

export const MinMaxScore = {
    MIN: -1000,
    MAX: 1000,
};

// TODO check correct direction
export const ScoreByPosition: Record<Fen, number[][]> = {
    [Fen.WHITE_PAWN]: PawnScoreMod.toReversed(),
    [Fen.BLACK_PAWN]: PawnScoreMod,
    [Fen.WHITE_KNIGHT]: KnightScoreMod.toReversed(),
    [Fen.BLACK_KNIGHT]: KnightScoreMod,
    [Fen.WHITE_BISHOP]: BishopScoreMod.toReversed(),
    [Fen.BLACK_BISHOP]: BishopScoreMod,
    [Fen.WHITE_ROOK]: RookScoreMod.toReversed(),
    [Fen.BLACK_ROOK]: RookScoreMod,
    [Fen.WHITE_QUEEN]: QueenScoreMod.toReversed(),
    [Fen.BLACK_QUEEN]: QueenScoreMod,
    [Fen.WHITE_KING]: KingScoreMod.toReversed(),
    [Fen.BLACK_KING]: KingScoreMod,
};

export const ScoreByPositionLate: Record<Fen, number[][]> = {
    ...ScoreByPosition,
    [Fen.WHITE_KING]: KingLateScoreMod.toReversed(),
    [Fen.BLACK_KING]: KingLateScoreMod,
};
