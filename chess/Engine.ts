import { ChessBoard } from "@/chess/ChessBoard";
import { COLUMNS, EngineDifficulty, MinMaxScore, PieceValue, ROWS, ScoreByPosition } from "@/chess/const";
import { Piece } from "@/chess/piece/Piece";
import { Color, Fen, Score } from "@/chess/type";

export class Engine {
    private chessBoard: ChessBoard;

    constructor(chessBoard: ChessBoard) {
        this.chessBoard = chessBoard;
    }

    public getEngineMove(engineDifficulty: EngineDifficulty) {
        const startTime = Date.now();

        const moveScores = this.minimax(
            this.chessBoard,
            engineDifficulty,
            MinMaxScore.MIN * 2,
            MinMaxScore.MAX * 2,
            this.chessBoard.playerColor === Color.WHITE,
        );

        const timeSpent = Date.now() - startTime;

        this.printMoveScore(moveScores, timeSpent);
        return moveScores;
    }

    private minimax(
        chessBoard: ChessBoard,
        depth: number,
        alpha: number,
        beta: number,
        maximizingPlayer: boolean,
    ): Score {
        if (depth === 0 || chessBoard.isGameOver)
            return { score: this.calculateScore(chessBoard, Color.WHITE), from: { x: 0, y: 0 }, to: { x: 0, y: 0 } };

        let bestScore: Score = {
            score: maximizingPlayer ? MinMaxScore.MIN : MinMaxScore.MAX,
            from: { x: 0, y: 0 },
            to: { x: 0, y: 0 },
            promotionPiece: null,
        };

        const currentColorQueen = chessBoard.playerColor === Color.WHITE ? Fen.WHITE_QUEEN : Fen.BLACK_QUEEN;
        let shouldBreak = false;

        for (const [fromRaw, toMoves] of chessBoard.safeSquares) {
            for (const to of toMoves) {
                const from = chessBoard.parseSafeSquareFrom(fromRaw);
                const testBoard = chessBoard.clone();
                const piece = testBoard.getPieceAt(from);
                if (!piece) continue;
                const promotionPiece = testBoard.willMoveBePromotion(piece.fen, to) ? currentColorQueen : null;
                testBoard.move(from.x, from.y, to.x, to.y, promotionPiece);

                const result = this.minimax(testBoard, depth - 1, alpha, beta, !maximizingPlayer);

                if (maximizingPlayer) {
                    if (result.score > bestScore.score) bestScore = { score: result.score, from, to, promotionPiece };
                    alpha = Math.max(alpha, result.score);
                    if (beta <= alpha) shouldBreak = true;
                } else {
                    if (result.score < bestScore.score) bestScore = { score: result.score, from, to, promotionPiece };
                    beta = Math.min(beta, result.score);
                    if (beta <= alpha) shouldBreak = true;
                }

                if (shouldBreak) break;
            }

            if (shouldBreak) break;
        }

        return bestScore!;
    }

    private calculateScore(chessBoard: ChessBoard, forPlayer: Color): number {
        // TODO possible optimization: do not recalculate material score if no pieces were captured in the last move
        return (
            this.calculateMaterialScore(chessBoard, forPlayer) + this.calculatePositionalScore(chessBoard, forPlayer)
        );
    }

    private calculateMaterialScore(chessBoard: ChessBoard, playerColor: Color, combined = false): number {
        let scoreIndex = 0;

        if (!combined && chessBoard.isMate)
            return chessBoard.playerColor === playerColor ? MinMaxScore.MIN : MinMaxScore.MAX;
        if (!combined && chessBoard.isGameOver)
            return chessBoard.playerColor === playerColor ? MinMaxScore.MAX : MinMaxScore.MIN;

        for (let x = 0; x < chessBoard.chessBoardSize; x++) {
            for (let y = 0; y < chessBoard.chessBoardSize; y++) {
                const piece = chessBoard.getPieceAt({ x, y });
                if (!piece) continue;

                if (combined) scoreIndex += PieceValue[piece.fen];
                else if (piece.color === playerColor) scoreIndex += PieceValue[piece.fen];
                else scoreIndex -= PieceValue[piece.fen];
            }
        }

        return scoreIndex;
    }

    private calculatePositionalScore(chessBoard: ChessBoard, playerColor: Color) {
        const scoreMultiplier = 0.5;
        let score = 0;

        for (let x = 0; x < chessBoard.chessBoardSize; x++) {
            for (let y = 0; y < chessBoard.chessBoardSize; y++) {
                const piece: Piece | null = chessBoard.board[x][y];
                if (!piece) continue;

                if (ScoreByPosition[piece.fen]) {
                    const scoreIndex = ScoreByPosition[piece.fen][x][y];
                    score += (piece.color === playerColor ? scoreIndex : -scoreIndex) * scoreMultiplier;
                }
            }
        }

        return score;
    }

    private printMoveScore(score: Score, timeSpent: number) {
        const scoreColor = score.score >= 0 ? "\x1b[32m" : "\x1b[31m";
        const moveColor = "\x1b[36m";
        const reset = "\x1b[0m";

        console.log(
            `${scoreColor}${score.score}${reset} (${moveColor}${COLUMNS[score.from.y]}${ROWS[score.from.x]}${reset} to ${moveColor}${COLUMNS[score.to.y]}${ROWS[score.to.x]}${reset}) in ${timeSpent}ms`,
        );
    }
}
