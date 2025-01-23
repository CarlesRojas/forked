import { ChessBoard } from "@/chess/ChessBoard";
import { DepthType, EngineDepthByDifficulty, EngineDifficulty, MinMaxScore, PieceValue } from "@/chess/const";
import { Piece } from "@/chess/piece/Piece";
import { Color, Fen, Score } from "@/chess/type";

export class Engine {
    private chessBoard: ChessBoard;

    constructor(chessBoard: ChessBoard) {
        this.chessBoard = chessBoard;
    }

    public getEngineMove(engineDifficulty: EngineDifficulty) {
        const moveScores = this.calculateAiMoves(engineDifficulty);
        return moveScores[0];
    }

    private calculateAiMoves(engineDifficulty: EngineDifficulty) {
        const difficulty: EngineDifficulty = Math.min(
            EngineDifficulty.GRANDMASTER,
            this.getTotalMaterialValue() < 50 ? engineDifficulty + 1 : engineDifficulty,
        );

        const scoreTable: Score[] = [];
        const initialScore = this.calculateScore(this.chessBoard, this.chessBoard.playerColor);

        for (const [fromRaw, toMoves] of this.chessBoard.safeSquares) {
            toMoves.map((to) => {
                const from = this.chessBoard.parseSafeSquareFrom(fromRaw);
                const testBoard = this.chessBoard.clone();
                const piece = testBoard.getPieceAt(from);
                if (!piece) return;

                const moveIsCapture = Boolean(testBoard.getPieceAt(to));
                const moveIsPromotion = testBoard.willMoveBePromotion(piece.fen, to);
                const promotionPiece = this.chessBoard.playerColor === Color.WHITE ? Fen.WHITE_QUEEN : Fen.BLACK_QUEEN;
                testBoard.move(from.x, from.y, to.x, to.y, moveIsPromotion ? promotionPiece : null);

                const nextMovesScore = this.getNextMovesScore(
                    testBoard,
                    this.chessBoard.playerColor,
                    difficulty,
                    moveIsCapture,
                    moveIsCapture ? this.calculateScore(testBoard, this.chessBoard.playerColor) : initialScore,
                ).score;

                const positionalScore = 0; // TODO testBoard.calculateScoreByPiecesLocation(this.chessBoard.playerColor);

                // TODO fifty move rule score?

                scoreTable.push({
                    from,
                    to,
                    score: nextMovesScore + positionalScore,
                });
            });
        }

        scoreTable.sort((previous, next) => {
            return previous.score < next.score ? 1 : previous.score > next.score ? -1 : 0;
        });

        return scoreTable;
    }

    private getNextMovesScore(
        chessBoard: ChessBoard,
        playingPlayerColor: Color,
        difficulty: EngineDifficulty,
        moveIsCapture: boolean,
        initialScore: number,
        depth = 1,
    ) {
        if (!chessBoard.isGameOver)
            return {
                score:
                    this.calculateScore(chessBoard, playingPlayerColor) +
                    (chessBoard.playerColor === playingPlayerColor ? depth : -depth),
                max: true,
            };

        const shouldContinue =
            (depth < EngineDepthByDifficulty[DepthType.EXTENDED][difficulty] && this.chessBoard.checkState.isInCheck) ||
            depth < EngineDepthByDifficulty[DepthType.BASE][difficulty] ||
            (moveIsCapture && depth < EngineDepthByDifficulty[DepthType.EXTENDED][difficulty]);

        if (!shouldContinue) {
            if (initialScore !== null) return { score: initialScore, max: false };
            const score = this.calculateScore(chessBoard, playingPlayerColor);
            return { score, max: false };
        }

        let bestScore = chessBoard.playerColor === playingPlayerColor ? MinMaxScore.MIN : MinMaxScore.MAX;
        let maxValueReached = false;

        for (const [fromRaw, toMoves] of this.chessBoard.safeSquares) {
            if (maxValueReached) continue;

            toMoves.map((to) => {
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

                const result = this.getNextMovesScore(
                    testBoard,
                    playingPlayerColor,
                    difficulty,
                    moveIsCapture,
                    moveIsCapture ? this.calculateScore(testBoard, playingPlayerColor) : initialScore,
                    depth + 1,
                );

                if (result.max) maxValueReached = true;

                if (chessBoard.playerColor === playingPlayerColor) bestScore = Math.max(bestScore, result.score);
                else bestScore = Math.min(bestScore, result.score);
            });
        }

        return { score: bestScore, max: false };
    }

    private getTotalMaterialValue(): number {
        let totalValue = 0;

        for (let x = 0; x < this.chessBoard.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoard.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard.board[x][y];
                if (!piece) continue;

                totalValue += PieceValue[piece.fen];
            }
        }

        return totalValue;
    }

    private calculateScore(chessBoard: ChessBoard, playerColor = this.chessBoard.playerColor): number {
        let scoreIndex = 0;

        if (chessBoard.isMate) return chessBoard.playerColor === playerColor ? MinMaxScore.MIN : MinMaxScore.MAX;
        if (chessBoard.isGameOver) return chessBoard.playerColor === playerColor ? MinMaxScore.MAX : MinMaxScore.MIN;

        for (let x = 0; x < chessBoard.chessBoardSize; x++) {
            for (let y = 0; y < chessBoard.chessBoardSize; y++) {
                const piece: Piece | null = chessBoard.board[x][y];
                if (!piece) continue;

                if (piece.color === playerColor) scoreIndex += PieceValue[piece.fen];
                else scoreIndex -= PieceValue[piece.fen];
            }
        }

        return scoreIndex;
    }
}
