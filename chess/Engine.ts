import { ChessBoard } from "@/chess/ChessBoard";
import {
    COLUMNS,
    DepthType,
    EngineDepthByDifficulty,
    EngineDifficulty,
    MinMaxScore,
    PieceValue,
    ROWS,
    ScoreByPosition,
} from "@/chess/const";
import { Piece } from "@/chess/piece/Piece";
import { Color, Fen, Score } from "@/chess/type";

export class Engine {
    private chessBoard: ChessBoard;

    constructor(chessBoard: ChessBoard) {
        this.chessBoard = chessBoard;
    }

    public getEngineMove(engineDifficulty: EngineDifficulty) {
        const moveScores = this.minimax(
            this.chessBoard,
            EngineDepthByDifficulty[DepthType.BASE][engineDifficulty],
            this.chessBoard.playerColor === Color.WHITE,
        );

        this.printMoveScore(moveScores);
        return moveScores;
    }

    private minimax(chessBoard: ChessBoard, depth: number, maximizingPlayer: boolean): Score {
        if (depth === 0 || chessBoard.isGameOver)
            return { score: this.calculateScore(chessBoard, Color.WHITE), from: { x: 0, y: 0 }, to: { x: 0, y: 0 } };

        let bestScore: Score | null = null;
        const promotionPiece = chessBoard.playerColor === Color.WHITE ? Fen.WHITE_QUEEN : Fen.BLACK_QUEEN;

        for (const [fromRaw, toMoves] of chessBoard.safeSquares) {
            toMoves.forEach((to) => {
                const from = chessBoard.parseSafeSquareFrom(fromRaw);
                const testBoard = chessBoard.clone();
                const piece = testBoard.getPieceAt(from);
                if (!piece) return;

                const moveIsPromotion = testBoard.willMoveBePromotion(piece.fen, to);
                testBoard.move(from.x, from.y, to.x, to.y, moveIsPromotion ? promotionPiece : null);

                const result = this.minimax(testBoard, depth - 1, !maximizingPlayer);
                if (
                    !bestScore ||
                    (maximizingPlayer && result.score > bestScore.score) ||
                    (!maximizingPlayer && result.score < bestScore.score)
                ) {
                    bestScore = {
                        score: result.score,
                        from,
                        to,
                        promotionPiece: moveIsPromotion ? promotionPiece : undefined,
                    };
                }
            });
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

    private printMoveScore(score: Score) {
        console.log(
            `Move from ${COLUMNS[score.from.y]}${ROWS[score.from.x]} to ${COLUMNS[score.to.y]}${ROWS[score.to.x]} (Score: ${score.score})`,
        );
    }
}
