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
        const moveScores = this.calculateAiMoves(engineDifficulty);
        this.printMoveScore(moveScores[0]);
        return moveScores[0];
    }

    private printMoveScore(score: Score) {
        console.log(
            `Move from ${COLUMNS[score.from.y]}${ROWS[score.from.x]} to ${COLUMNS[score.to.y]}${ROWS[score.to.x]} (Score: ${score.score}, Depth: ${score.depth})`,
        );
    }

    private calculateAiMoves(engineDifficulty: EngineDifficulty) {
        const difficulty: EngineDifficulty = Math.min(
            EngineDifficulty.GRANDMASTER,
            this.calculateMaterialScore(this.chessBoard, this.chessBoard.playerColor, true) < 50
                ? engineDifficulty + 1
                : engineDifficulty,
        );

        const scoreTable: Score[] = [];
        const initialScore = this.calculateMaterialScore(this.chessBoard, this.chessBoard.playerColor);

        for (const [fromRaw, toMoves] of this.chessBoard.safeSquares) {
            toMoves.forEach((to) => {
                const from = this.chessBoard.parseSafeSquareFrom(fromRaw);
                const testBoard = this.chessBoard.clone();
                const piece = testBoard.getPieceAt(from);
                if (!piece) return;

                const moveIsCapture = Boolean(testBoard.getPieceAt(to));
                const moveIsPromotion = testBoard.willMoveBePromotion(piece.fen, to);
                const promotionPiece = this.chessBoard.playerColor === Color.WHITE ? Fen.WHITE_QUEEN : Fen.BLACK_QUEEN;
                testBoard.move(from.x, from.y, to.x, to.y, moveIsPromotion ? promotionPiece : null);

                const nextMovesScore = this.calculateNextMovesScore(
                    testBoard,
                    this.chessBoard.playerColor,
                    difficulty,
                    moveIsCapture,
                    moveIsCapture ? this.calculateMaterialScore(testBoard, this.chessBoard.playerColor) : initialScore,
                );

                const positionalScore = this.calculatePositionalScore(testBoard, this.chessBoard.playerColor);

                // printBoard(testBoard);
                // console.log("Scores", nextMovesScore, positionalScore);

                // TODO fifty move rule score?

                scoreTable.push({
                    from,
                    to,
                    score: nextMovesScore.score + positionalScore,
                    depth: nextMovesScore.depth,
                });
            });
        }

        scoreTable.sort((previous, next) => {
            return previous.score < next.score ? 1 : previous.score > next.score ? -1 : 0;
        });

        return scoreTable;
    }

    private calculateNextMovesScore(
        chessBoard: ChessBoard,
        playingPlayerColor: Color,
        difficulty: EngineDifficulty,
        moveIsCapture: boolean,
        initialScore: number,
        depth = 1,
    ) {
        if (chessBoard.isGameOver)
            return {
                score:
                    this.calculateMaterialScore(chessBoard, playingPlayerColor) +
                    (chessBoard.playerColor === playingPlayerColor ? depth : -depth),
                max: true,
                depth,
            };

        const shouldContinue =
            (depth < EngineDepthByDifficulty[DepthType.EXTENDED][difficulty] && this.chessBoard.checkState.isInCheck) ||
            depth < EngineDepthByDifficulty[DepthType.BASE][difficulty] ||
            (moveIsCapture && depth < EngineDepthByDifficulty[DepthType.EXTENDED][difficulty]);

        if (!shouldContinue) {
            if (initialScore !== null) return { score: initialScore, max: false, depth };
            const score = this.calculateMaterialScore(chessBoard, playingPlayerColor);
            return { score, max: false, depth };
        }

        let bestScore = chessBoard.playerColor === playingPlayerColor ? MinMaxScore.MIN : MinMaxScore.MAX;
        let maxValueReached = false;
        let maxDepth = depth;

        for (const [fromRaw, toMoves] of this.chessBoard.safeSquares) {
            if (maxValueReached) continue;

            toMoves.forEach((to) => {
                if (maxValueReached) return;
                const from = this.chessBoard.parseSafeSquareFrom(fromRaw);
                const testBoard = this.chessBoard.clone();
                const piece = testBoard.getPieceAt(from);
                if (!piece) return;

                const moveIsCapture = Boolean(testBoard.getPieceAt(to));
                const moveIsPromotion = testBoard.willMoveBePromotion(piece.fen, to);
                const promotionPiece = this.chessBoard.playerColor === Color.WHITE ? Fen.WHITE_QUEEN : Fen.BLACK_QUEEN;
                testBoard.move(from.x, from.y, to.x, to.y, moveIsPromotion ? promotionPiece : null);
                if (testBoard.checkState.isInCheck) return;

                const result = this.calculateNextMovesScore(
                    testBoard,
                    playingPlayerColor,
                    difficulty,
                    moveIsCapture,
                    moveIsCapture ? this.calculateMaterialScore(testBoard, testBoard.playerColor) : initialScore,
                    depth + 1,
                );

                if (result.max) maxValueReached = true;
                maxDepth = Math.max(maxDepth, result.depth);

                if (chessBoard.playerColor === playingPlayerColor) bestScore = Math.max(bestScore, result.score);
                else bestScore = Math.min(bestScore, result.score);
            });
        }

        return { score: bestScore, max: false, depth: maxDepth };
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

    private calculateMaterialScore(chessBoard: ChessBoard, playerColor: Color, combined = false): number {
        let scoreIndex = 0;

        if (chessBoard.isMate) return chessBoard.playerColor === playerColor ? MinMaxScore.MIN : MinMaxScore.MAX;
        if (chessBoard.isGameOver) return chessBoard.playerColor === playerColor ? MinMaxScore.MAX : MinMaxScore.MIN;

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
}
