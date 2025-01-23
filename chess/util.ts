import { ChessBoard } from "@/chess/ChessBoard";
import { Color, Fen } from "@/chess/type";

export const printBoard = (chessBoard: ChessBoard): void => {
    const unicodePieces: Record<Fen, string> = {
        [Fen.WHITE_KING]: "♚",
        [Fen.WHITE_QUEEN]: "♛",
        [Fen.WHITE_ROOK]: "♜",
        [Fen.WHITE_BISHOP]: "♝",
        [Fen.WHITE_KNIGHT]: "♞",
        [Fen.WHITE_PAWN]: "♟",
        [Fen.BLACK_KING]: "♚",
        [Fen.BLACK_QUEEN]: "♛",
        [Fen.BLACK_ROOK]: "♜",
        [Fen.BLACK_BISHOP]: "♝",
        [Fen.BLACK_KNIGHT]: "♞",
        [Fen.BLACK_PAWN]: "♟",
    };

    console.log("%c" + "─", "font-size: 48px; color: #00000000;");
    console.log("%c" + "─", "font-size: 48px; color: #00000000;");

    for (let x = chessBoard.chessBoardSize - 1; x >= 0; x--) {
        let row = "";
        const styles: string[] = [];
        for (let y = 0; y < chessBoard.chessBoardSize; y++) {
            const piece = chessBoard.getPieceAt({ x, y });

            const lastMove = chessBoard.lastMove;

            if (piece) {
                let color = piece.color === Color.WHITE ? "#FFFFFF" : "#000000";
                if (lastMove && lastMove.currX === x && lastMove.currY === y) color = "#7ab2ff";

                row += `%c${unicodePieces[piece.fen]} `;
                styles.push(`font-size: 48px; color: ${color}; `);
            } else {
                let color = "#666666";
                if (lastMove && lastMove.prevX === x && lastMove.prevY === y) color = "#7ab2ff";

                row += "%c· ";
                styles.push(`font-size: 48px; color: ${color}; `);
            }
        }
        console.log(row, ...styles);
    }
};
