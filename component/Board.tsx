"use client";
import { useRef } from "react";

import { ChessBoard } from "@/chess/ChessBoard";
import { CheckState, Color, Coords, Fen, LastMove, SelectedSquare } from "@/chess/type";
import Piece from "@/component/Piece";
import Tile from "@/component/Tile";
import { chessBoardAtom } from "@/state/game";
import { useAtomValue } from "jotai";
import { useState } from "react";

const Board = () => {
    const chessBoard = useAtomValue(chessBoardAtom);
    const [chessBoardView, setChessBoardView] = useState(chessBoard.chessBoardView);

    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>({ piece: null });
    const [pieceSafeSquares, setPieceSafeSquares] = useState<Coords[]>([]);
    const [lastMove, setLastMove] = useState<LastMove | undefined>(chessBoard.lastMove);
    const [checkState, setCheckState] = useState<CheckState>(chessBoard.checkState);

    const [isPromotionActive, setIsPromotionActive] = useState<boolean>(false);
    const [promotionCoords, setPromotionCoords] = useState<Coords | null>(null);
    const [promotedPiece, setPromotedPiece] = useState<Fen | null>(null);

    const promotionPieces = useRef<Fen[]>(
        chessBoard.playerColor === Color.WHITE
            ? [Fen.WHITE_KNIGHT, Fen.WHITE_BISHOP, Fen.WHITE_ROOK, Fen.WHITE_QUEEN]
            : [Fen.BLACK_KNIGHT, Fen.BLACK_BISHOP, Fen.BLACK_ROOK, Fen.BLACK_QUEEN],
    );

    const isSquareDark = (coords: Coords) => {
        return ChessBoard.isSquareDark(coords);
    };

    const isSquareSelected = (coords: Coords) => {
        if (!selectedSquare.piece) return false;
        return selectedSquare.coords.x === coords.x && selectedSquare.coords.y === coords.y;
    };

    const isSquareMoveForSelectedPiece = (coords: Coords) => {
        return pieceSafeSquares.some((squareCoords) => squareCoords.x === coords.x && squareCoords.y === coords.y);
    };

    const isSquareCaptureForSelectedPiece = (coords: Coords) => {
        const piece: Fen | null = chessBoard.chessBoardView[coords.x][coords.y];
        return (
            !!piece &&
            pieceSafeSquares.some((squareCoords) => squareCoords.x === coords.x && squareCoords.y === coords.y)
        );
    };

    const isSquareLastMove = (coords: Coords) => {
        if (!lastMove) return false;
        const { prevX, prevY, currX, currY } = lastMove;
        return (coords.x === prevX && coords.y === prevY) || (coords.x === currX && coords.y === currY);
    };

    const isSquareChecked = (coords: Coords) => {
        return checkState.isInCheck && checkState.coords.x === coords.x && checkState.coords.y === coords.y;
    };

    const isSquarePromotionSquare = (coords: Coords) => {
        if (!promotionCoords) return false;
        return promotionCoords.x === coords.x && promotionCoords.y === coords.y;
    };

    const unmarkMoves = () => {
        setSelectedSquare({ piece: null });
        setPieceSafeSquares([]);

        if (isPromotionActive) {
            setIsPromotionActive(false);
            setPromotedPiece(null);
            setPromotionCoords(null);
        }
    };

    const isWrongPieceSelected = (piece: Fen): boolean => {
        const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
        return (
            (isWhitePieceSelected && chessBoard.playerColor === Color.BLACK) ||
            (!isWhitePieceSelected && chessBoard.playerColor === Color.WHITE)
        );
    };

    const selectPiece = (coords: Coords) => {
        if (chessBoard.gameOverMessage !== undefined) return;
        const piece: Fen | null = chessBoard.chessBoardView[coords.x][coords.y];
        if (!piece || isWrongPieceSelected(piece)) return;

        unmarkMoves();

        const isSameSquareClicked: boolean =
            !!selectedSquare.piece && selectedSquare.coords.x === coords.x && selectedSquare.coords.y === coords.y;
        if (isSameSquareClicked) return;

        setSelectedSquare({ piece, coords });
        setPieceSafeSquares(chessBoard.safeSquares.get(coords.x + "," + coords.y) || []);
    };

    const updateBoard = (prevCoords: Coords, newCoords: Coords, promotedPiece: Fen | null) => {
        chessBoard.move(prevCoords.x, prevCoords.y, newCoords.x, newCoords.y, promotedPiece);
        setChessBoardView(chessBoard.chessBoardView);
        setLastMove(chessBoard.lastMove);
        setCheckState(chessBoard.checkState);
        unmarkMoves();
    };

    const placePiece = (newCoords: Coords) => {
        if (!selectedSquare.piece) return;
        if (!isSquareMoveForSelectedPiece(newCoords)) return;

        const isPawnSelected: boolean =
            selectedSquare.piece === Fen.WHITE_PAWN || selectedSquare.piece === Fen.BLACK_PAWN;
        const isPawnOnlastRank: boolean = isPawnSelected && (newCoords.x === 7 || newCoords.x === 0);
        const shouldOpenPromotionDialog: boolean = !isPromotionActive && isPawnOnlastRank;

        if (shouldOpenPromotionDialog) {
            setPieceSafeSquares([]);
            setIsPromotionActive(true);
            setPromotionCoords(newCoords);
            // Wait for player to choose promoted piece
            return;
        }

        const { coords: prevCoords } = selectedSquare;
        updateBoard(prevCoords, newCoords, promotedPiece);
    };

    const promotePiece = (piece: Fen) => {
        if (!promotionCoords || !selectedSquare.piece) return;
        setPromotedPiece(piece);
        const { coords: prevCoords } = selectedSquare;
        updateBoard(prevCoords, promotionCoords, promotedPiece);
    };

    return (
        <main className="relative aspect-square h-full">
            <div className="grid h-full w-fit grid-cols-8 grid-rows-8">
                {Array.from({ length: 8 }).map((_, x) =>
                    Array.from({ length: 8 }).map((_, y) => (
                        <Tile
                            key={`${x}-${y}`}
                            coords={{ x, y }}
                            isSquareDark={isSquareDark}
                            isSquareSelected={isSquareSelected}
                            isSquareMoveForSelectedPiece={isSquareMoveForSelectedPiece}
                            isSquareCaptureForSelectedPiece={isSquareCaptureForSelectedPiece}
                            isSquareLastMove={isSquareLastMove}
                            isSquareChecked={isSquareChecked}
                            isSquarePromotionSquare={isSquarePromotionSquare}
                            onTileClicked={(coords) => {
                                console.log("clicked", coords);
                                selectPiece(coords);
                                placePiece(coords);
                            }}
                        />
                    )),
                )}
            </div>

            <div
                className="pointer-events-none absolute inset-0 grid grid-cols-8 grid-rows-8 select-none"
                style={{ imageRendering: "pixelated" }}
            >
                {chessBoardView.map((row, x) =>
                    row.map((fen, y) => <Piece key={`${x}-${y}`} coords={{ x, y }} fen={fen} />),
                )}
            </div>
        </main>
    );
};

export default Board;
