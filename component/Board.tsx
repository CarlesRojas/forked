/* eslint-disable @next/next/no-img-element */
"use client";

import { ChessBoard } from "@/chess/ChessBoard";
import { useStockfish } from "@/chess/stockfish/useStockfish";
import { CheckState, Color, Coords, Fen, LastMove, PieceImage, SelectedSquare } from "@/chess/type";
import EvaluationBar from "@/component/EvaluationBar";
import Piece from "@/component/Piece";
import PromotionDialog from "@/component/PromotionDialog";
import Tile from "@/component/Tile";
import { cn } from "@/lib/cn";
import { chessBoardAtom } from "@/state/game";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor } from "@dnd-kit/core";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";

const Board = () => {
    const chessBoard = useAtomValue(chessBoardAtom);
    const [chessBoardView, setChessBoardView] = useState(chessBoard.chessBoardView);

    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>({ piece: null });
    const [pieceSafeSquares, setPieceSafeSquares] = useState<Coords[]>([]);
    const [lastMove, setLastMove] = useState<LastMove | undefined>(chessBoard.lastMove);
    const [checkState, setCheckState] = useState<CheckState>(chessBoard.checkState);

    const [isPromotionActive, setIsPromotionActive] = useState<boolean>(false);
    const [promotionCoords, setPromotionCoords] = useState<Coords | null>(null);

    const { evaluate, bestMove, mateIn, evaluation } = useStockfish();

    const [isEngineTurn, setIsEngineTurn] = useState<boolean>(false);

    const [draggedPiece, setDraggedPiece] = useState<{ fen: Fen; coords: Coords } | null>(null);

    const getPromotionOptions = () => {
        return chessBoard.playerColor === Color.WHITE
            ? [Fen.WHITE_QUEEN, Fen.WHITE_ROOK, Fen.WHITE_BISHOP, Fen.WHITE_KNIGHT]
            : [Fen.BLACK_QUEEN, Fen.BLACK_ROOK, Fen.BLACK_BISHOP, Fen.BLACK_KNIGHT];
    };

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

    const unmarkMoves = useCallback(() => {
        setSelectedSquare({ piece: null });
        setPieceSafeSquares([]);

        if (isPromotionActive) {
            setIsPromotionActive(false);
            setPromotionCoords(null);
        }
    }, [isPromotionActive]);

    const isWrongPieceSelected = (piece: Fen): boolean => {
        const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
        return (
            (isWhitePieceSelected && chessBoard.playerColor === Color.BLACK) ||
            (!isWhitePieceSelected && chessBoard.playerColor === Color.WHITE)
        );
    };

    const selectPiece = (coords: Coords) => {
        if (chessBoard.isGameOver) return;
        const piece: Fen | null = chessBoard.chessBoardView[coords.x][coords.y];
        if (!piece || isWrongPieceSelected(piece)) return;

        unmarkMoves();

        const isSameSquareClicked: boolean =
            !!selectedSquare.piece && selectedSquare.coords.x === coords.x && selectedSquare.coords.y === coords.y;
        if (isSameSquareClicked) return;

        setSelectedSquare({ piece, coords });
        setPieceSafeSquares(chessBoard.safeSquares.get(coords.x + "," + coords.y) || []);
    };

    const updateBoard = useCallback(
        (prevCoords: Coords, newCoords: Coords, promotedPiece?: Fen | null) => {
            chessBoard.move(prevCoords.x, prevCoords.y, newCoords.x, newCoords.y, promotedPiece ?? null);
            setChessBoardView(chessBoard.chessBoardView);
            setLastMove(chessBoard.lastMove);
            setCheckState(chessBoard.checkState);
            unmarkMoves();

            setIsEngineTurn(chessBoard.playerColor === Color.BLACK);
            evaluate({ fen: chessBoard.boardAsFEN, isGameOver: chessBoard.isGameOver, turn: chessBoard.playerColor });
        },
        [chessBoard, evaluate, unmarkMoves],
    );

    const placePiece = (newCoords: Coords) => {
        if (!selectedSquare.piece) return;
        if (!isSquareMoveForSelectedPiece(newCoords)) return;
        const shouldOpenPromotionDialog: boolean =
            !isPromotionActive && chessBoard.willMoveBePromotion(selectedSquare.piece, newCoords);

        if (shouldOpenPromotionDialog) {
            setPieceSafeSquares([]);
            setIsPromotionActive(true);
            setPromotionCoords(newCoords);
            // Wait for player to choose promoted piece
            return;
        }

        const { coords: prevCoords } = selectedSquare;
        updateBoard(prevCoords, newCoords, null);
    };

    const promotePiece = (piece: Fen) => {
        if (!promotionCoords || !selectedSquare.piece) return;
        const { coords: prevCoords } = selectedSquare;
        updateBoard(prevCoords, promotionCoords, piece);
    };

    useEffect(() => {
        if (bestMove && isEngineTurn) {
            const { from, to, promotion } = bestMove;
            updateBoard(from, to, promotion);
        }
    }, [bestMove, isEngineTurn, updateBoard]);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    });

    const handleDragEnd = ({ over }: DragEndEvent) => {
        setDraggedPiece(null);
        if (!over) return;

        const toCoords: Coords = JSON.parse(over.id as string);
        placePiece(toCoords);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const fromCoords: Coords = JSON.parse(event.active.id as string);
        const fen = chessBoard.chessBoardView[fromCoords.x][fromCoords.y];
        if (fen) setDraggedPiece({ fen, coords: fromCoords });

        if (!selectedSquare.piece) {
            selectPiece(fromCoords);
            return;
        }

        const isSamePiece = selectedSquare.coords.x === fromCoords.x && selectedSquare.coords.y === fromCoords.y;

        if (!isSamePiece) {
            selectPiece(selectedSquare.coords);
            selectPiece(fromCoords);
        }
    };

    return (
        <main className="relative flex h-full w-full gap-6">
            <EvaluationBar evaluation={evaluation} mateIn={mateIn} gameOver={chessBoard.gameOver} />

            <div className={cn("relative aspect-square h-full", isEngineTurn && "pointer-events-none")}>
                <DndContext
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToWindowEdges, snapCenterToCursor]}
                    sensors={[pointerSensor]}
                >
                    <div className="pointer-events-none grid h-full w-fit grid-cols-8 grid-rows-8">
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
                                />
                            )),
                        )}
                    </div>

                    <div className="absolute inset-0 z-10 grid grid-cols-8 grid-rows-8 select-none">
                        {chessBoardView
                            .map((row, x) =>
                                row.map((fen, y) => (
                                    <Piece
                                        key={`${x}-${y}`}
                                        coords={{ x, y }}
                                        fen={fen}
                                        onPieceClicked={(coords) => {
                                            selectPiece(coords);
                                            placePiece(coords);
                                        }}
                                    />
                                )),
                            )
                            .reverse()}
                    </div>

                    <DragOverlay>
                        {draggedPiece ? (
                            <div className="relative flex size-full items-center justify-center">
                                <img
                                    className="pointer-events-none h-[70%] w-[70%] select-none"
                                    style={{ imageRendering: "pixelated" }}
                                    src={PieceImage[draggedPiece.fen]}
                                    alt={`${draggedPiece.fen} piece`}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                <PromotionDialog
                    getPromotionOptions={getPromotionOptions}
                    onPromote={promotePiece}
                    isPromotionActive={true}
                />
            </div>
        </main>
    );
};

export default Board;
