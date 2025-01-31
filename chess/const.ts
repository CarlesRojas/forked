import { SavedGameSchema } from "@/chess/type";

export const MAX_ENGINE_THINK_TIME = 4000;

export const COLUMNS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export const EVAL_BAR_LIMIT = 10;

export const DEFAULT_SAVED_GAME = SavedGameSchema.parse({
    board: [
        [
            { fen: "R", material: "d", base: "d", hasMoved: false },
            { fen: "N", material: "d", base: "d" },
            { fen: "B", material: "d", base: "d" },
            { fen: "Q", material: "d", base: "d" },
            { fen: "K", material: "d", base: "d", hasMoved: false },
            { fen: "B", material: "d", base: "d" },
            { fen: "N", material: "d", base: "d" },
            { fen: "R", material: "d", base: "d", hasMoved: false },
        ],
        [
            { fen: "P", material: "d", base: "d", hasMoved: false },
            { fen: "P", material: "d", base: "d", hasMoved: false },
            { fen: "P", material: "d", base: "d", hasMoved: false },
            { fen: "P", material: "d", base: "d", hasMoved: false },
            { fen: "P", material: "d", base: "d", hasMoved: false },
            { fen: "P", material: "d", base: "d", hasMoved: false },
            { fen: "P", material: "d", base: "d", hasMoved: false },
            { fen: "P", material: "d", base: "d", hasMoved: false },
        ],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [
            { fen: "p", material: "d", base: "d", hasMoved: false },
            { fen: "p", material: "d", base: "d", hasMoved: false },
            { fen: "p", material: "d", base: "d", hasMoved: false },
            { fen: "p", material: "d", base: "d", hasMoved: false },
            { fen: "p", material: "d", base: "d", hasMoved: false },
            { fen: "p", material: "d", base: "d", hasMoved: false },
            { fen: "p", material: "d", base: "d", hasMoved: false },
            { fen: "p", material: "d", base: "d", hasMoved: false },
        ],
        [
            { fen: "r", material: "d", base: "d", hasMoved: false },
            { fen: "n", material: "d", base: "d" },
            { fen: "b", material: "d", base: "d" },
            { fen: "q", material: "d", base: "d" },
            { fen: "k", material: "d", base: "d", hasMoved: false },
            { fen: "b", material: "d", base: "d" },
            { fen: "n", material: "d", base: "d" },
            { fen: "r", material: "d", base: "d", hasMoved: false },
        ],
    ],
    playerColor: "WHITE",
    lastMove: null,
    checkState: {
        isInCheck: false,
    },
    fiftyMoveRuleCounter: 0,
    isGameOver: false,
    gameOver: null,
    fullNumberOfMoves: 1,
    threeFoldRepetitionDictionary: [],
    threeFoldRepetitionFlag: false,
    boardAsFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    moveList: [],
    gameHistory: [
        {
            board: [
                ["R", "N", "B", "Q", "K", "B", "N", "R"],
                ["P", "P", "P", "P", "P", "P", "P", "P"],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null],
                ["p", "p", "p", "p", "p", "p", "p", "p"],
                ["r", "n", "b", "q", "k", "b", "n", "r"],
            ],
            checkState: {
                isInCheck: false,
            },
        },
    ],
});
