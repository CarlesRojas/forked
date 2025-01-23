import { COLUMNS } from "@/chess/const";
import { FenConverter } from "@/chess/FenConverter";
import { Bishop } from "@/chess/piece/Bishop";
import { King } from "@/chess/piece/King";
import { Knight } from "@/chess/piece/Knight";
import { Pawn } from "@/chess/piece/Pawn";
import { Piece } from "@/chess/piece/Piece";
import { Queen } from "@/chess/piece/Queen";
import { Rook } from "@/chess/piece/Rook";
import { CheckState, Color, Coords, Fen, GameHistory, LastMove, MoveList, MoveType, SafeSquares } from "@/chess/type";

export class ChessBoard {
    private chessBoard: (Piece | null)[][];
    public readonly chessBoardSize: number = 8;
    private _playerColor = Color.WHITE;
    private _safeSquares: SafeSquares;
    private _lastMove: LastMove | undefined;
    private _checkState: CheckState = { isInCheck: false };
    private _fiftyMoveRuleCounter: number = 0;

    private _isGameOver: boolean = false;
    private _gameOverMessage: string | undefined;
    private _isMate: boolean = false;

    private fullNumberOfMoves: number = 1;
    private threeFoldRepetitionDictionary = new Map<string, number>();
    private threeFoldRepetitionFlag: boolean = false;

    private _boardAsFEN: string = FenConverter.initalPosition;
    private fenConverter = new FenConverter();

    private _moveList: MoveList = [];
    private _gameHistory: GameHistory;

    constructor() {
        this.chessBoard = [
            [
                new Rook(Color.WHITE),
                new Knight(Color.WHITE),
                new Bishop(Color.WHITE),
                new Queen(Color.WHITE),
                new King(Color.WHITE),
                new Bishop(Color.WHITE),
                new Knight(Color.WHITE),
                new Rook(Color.WHITE),
            ],
            [
                new Pawn(Color.WHITE),
                new Pawn(Color.WHITE),
                new Pawn(Color.WHITE),
                new Pawn(Color.WHITE),
                new Pawn(Color.WHITE),
                new Pawn(Color.WHITE),
                new Pawn(Color.WHITE),
                new Pawn(Color.WHITE),
            ],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [
                new Pawn(Color.BLACK),
                new Pawn(Color.BLACK),
                new Pawn(Color.BLACK),
                new Pawn(Color.BLACK),
                new Pawn(Color.BLACK),
                new Pawn(Color.BLACK),
                new Pawn(Color.BLACK),
                new Pawn(Color.BLACK),
            ],
            [
                new Rook(Color.BLACK),
                new Knight(Color.BLACK),
                new Bishop(Color.BLACK),
                new Queen(Color.BLACK),
                new King(Color.BLACK),
                new Bishop(Color.BLACK),
                new Knight(Color.BLACK),
                new Rook(Color.BLACK),
            ],
        ];
        this._safeSquares = this.findSafeSqures();
        this._gameHistory = [{ board: this.chessBoardView, lastMove: this._lastMove, checkState: this._checkState }];
    }

    public clone(): ChessBoard {
        const newBoard = new ChessBoard();

        newBoard.chessBoard = this.chessBoard.map((row) => row.map((piece) => (piece ? piece.clone() : null)));

        newBoard._playerColor = this._playerColor;
        newBoard._fiftyMoveRuleCounter = this._fiftyMoveRuleCounter;
        newBoard._isGameOver = this._isGameOver;
        newBoard._gameOverMessage = this._gameOverMessage;
        newBoard._isMate = this._isMate;
        newBoard.fullNumberOfMoves = this.fullNumberOfMoves;
        newBoard.threeFoldRepetitionFlag = this.threeFoldRepetitionFlag;
        newBoard._boardAsFEN = this._boardAsFEN;

        newBoard._safeSquares = new Map(
            Array.from(this._safeSquares.entries()).map(([key, coords]) => [key, [...coords]]),
        );

        newBoard._lastMove = this._lastMove
            ? {
                  ...this._lastMove,
                  piece: this._lastMove.piece.clone(),
                  moveType: new Set([...this._lastMove.moveType]),
              }
            : undefined;

        newBoard._checkState = this._checkState.isInCheck
            ? { ...this._checkState, coords: { ...this._checkState.coords } }
            : { ...this._checkState };

        newBoard.threeFoldRepetitionDictionary = new Map(
            Array.from(this.threeFoldRepetitionDictionary.entries()).map(([key, value]) => [key, value]),
        );

        return newBoard;
    }

    public get board(): (Piece | null)[][] {
        return this.chessBoard;
    }

    public get playerColor(): Color {
        return this._playerColor;
    }

    public get fiftyMoveRuleCounter(): number {
        return this._fiftyMoveRuleCounter;
    }

    public get chessBoardView(): (Fen | null)[][] {
        return this.chessBoard.map((row) => {
            return row.map((piece) => (piece instanceof Piece ? piece.fen : null));
        });
    }

    public get safeSquares(): SafeSquares {
        return this._safeSquares;
    }

    public get lastMove(): LastMove | undefined {
        return this._lastMove;
    }

    public get checkState(): CheckState {
        return this._checkState;
    }

    public get isMate(): boolean {
        return this._isMate;
    }

    public get isGameOver(): boolean {
        return this._isGameOver;
    }

    public get gameOverMessage(): string | undefined {
        return this._gameOverMessage;
    }

    public get boardAsFEN(): string {
        return this._boardAsFEN;
    }

    public get moveList(): MoveList {
        return this._moveList;
    }

    public get gameHistory(): GameHistory {
        return this._gameHistory;
    }

    public static isSquareDark(coords: Coords): boolean {
        return (coords.x % 2 === 0 && coords.y % 2 === 0) || (coords.x % 2 === 1 && coords.y % 2 === 1);
    }

    private areCoordsValid(coords: Coords): boolean {
        return coords.x >= 0 && coords.y >= 0 && coords.x < this.chessBoardSize && coords.y < this.chessBoardSize;
    }

    public isInCheck(playerColor: Color, checkingCurrentPosition: boolean): boolean {
        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece || piece.color === playerColor) continue;

                for (const { x: dx, y: dy } of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if (!this.areCoordsValid({ x: newX, y: newY })) continue;

                    if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
                        if (piece instanceof Pawn && dy === 0) continue;

                        const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                        if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
                            if (checkingCurrentPosition)
                                this._checkState = { isInCheck: true, coords: { x: newX, y: newY } };
                            return true;
                        }
                    } else {
                        while (this.areCoordsValid({ x: newX, y: newY })) {
                            const attackedPiece: Piece | null = this.chessBoard[newX][newY];
                            if (attackedPiece instanceof King && attackedPiece.color === playerColor) {
                                if (checkingCurrentPosition)
                                    this._checkState = { isInCheck: true, coords: { x: newX, y: newY } };
                                return true;
                            }

                            if (attackedPiece !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }
                }
            }
        }
        if (checkingCurrentPosition) this._checkState = { isInCheck: false };
        return false;
    }

    private isPositionSafeAfterMove(prevX: number, prevY: number, newX: number, newY: number): boolean {
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece) return false;

        const newPiece: Piece | null = this.chessBoard[newX][newY];
        // we cant put piece on a square that already contains piece of the same square
        if (newPiece && newPiece.color === piece.color) return false;

        // simulate position
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        const isPositionSafe: boolean = !this.isInCheck(piece.color, false);

        // restore position back
        this.chessBoard[prevX][prevY] = piece;
        this.chessBoard[newX][newY] = newPiece;

        return isPositionSafe;
    }

    private findSafeSqures(): SafeSquares {
        const safeSqures: SafeSquares = new Map<string, Coords[]>();

        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece || piece.color !== this._playerColor) continue;

                const pieceSafeSquares: Coords[] = [];

                for (const { x: dx, y: dy } of piece.directions) {
                    let newX: number = x + dx;
                    let newY: number = y + dy;

                    if (!this.areCoordsValid({ x: newX, y: newY })) continue;

                    let newPiece: Piece | null = this.chessBoard[newX][newY];
                    if (newPiece && newPiece.color === piece.color) continue;

                    // need to restrict pawn moves in certain directions
                    if (piece instanceof Pawn) {
                        // cant move pawn two squares straight if there is piece infront of him
                        if (dx === 2 || dx === -2) {
                            if (newPiece) continue;
                            if (this.chessBoard[newX + (dx === 2 ? -1 : 1)][newY]) continue;
                        }

                        // cant move pawn one square straight if piece is infront of him
                        if ((dx === 1 || dx === -1) && dy === 0 && newPiece) continue;

                        // cant move pawn diagonally if there is no piece, or piece has same color as pawn
                        if ((dy === 1 || dy === -1) && (!newPiece || piece.color === newPiece.color)) continue;
                    }

                    if (piece instanceof Pawn || piece instanceof Knight || piece instanceof King) {
                        if (this.isPositionSafeAfterMove(x, y, newX, newY)) pieceSafeSquares.push({ x: newX, y: newY });
                    } else {
                        while (this.areCoordsValid({ x: newX, y: newY })) {
                            newPiece = this.chessBoard[newX][newY];
                            if (newPiece && newPiece.color === piece.color) break;

                            if (this.isPositionSafeAfterMove(x, y, newX, newY))
                                pieceSafeSquares.push({ x: newX, y: newY });

                            if (newPiece !== null) break;

                            newX += dx;
                            newY += dy;
                        }
                    }
                }

                if (piece instanceof King) {
                    if (this.canCastle(piece, true)) pieceSafeSquares.push({ x, y: 6 });

                    if (this.canCastle(piece, false)) pieceSafeSquares.push({ x, y: 2 });
                } else if (piece instanceof Pawn && this.canCaptureEnPassant(piece, x, y))
                    pieceSafeSquares.push({ x: x + (piece.color === Color.WHITE ? 1 : -1), y: this._lastMove!.prevY });

                if (pieceSafeSquares.length) safeSqures.set(x + "," + y, pieceSafeSquares);
            }
        }

        return safeSqures;
    }

    private canCaptureEnPassant(pawn: Pawn, pawnX: number, pawnY: number): boolean {
        if (!this._lastMove) return false;
        const { piece, prevX, currX, currY } = this._lastMove;

        if (
            !(piece instanceof Pawn) ||
            pawn.color !== this._playerColor ||
            Math.abs(currX - prevX) !== 2 ||
            pawnX !== currX ||
            Math.abs(pawnY - currY) !== 1
        )
            return false;

        const pawnNewPositionX: number = pawnX + (pawn.color === Color.WHITE ? 1 : -1);
        const pawnNewPositionY: number = currY;

        this.chessBoard[currX][currY] = null;
        const isPositionSafe: boolean = this.isPositionSafeAfterMove(pawnX, pawnY, pawnNewPositionX, pawnNewPositionY);
        this.chessBoard[currX][currY] = piece;

        return isPositionSafe;
    }

    private canCastle(king: King, kingSideCastle: boolean): boolean {
        if (king.hasMoved) return false;

        const kingPositionX: number = king.color === Color.WHITE ? 0 : 7;
        const kingPositionY: number = 4;
        const rookPositionX: number = kingPositionX;
        const rookPositionY: number = kingSideCastle ? 7 : 0;
        const rook: Piece | null = this.chessBoard[rookPositionX][rookPositionY];

        if (!(rook instanceof Rook) || rook.hasMoved || this._checkState.isInCheck) return false;

        const firstNextKingPositionY: number = kingPositionY + (kingSideCastle ? 1 : -1);
        const secondNextKingPositionY: number = kingPositionY + (kingSideCastle ? 2 : -2);

        if (
            this.chessBoard[kingPositionX][firstNextKingPositionY] ||
            this.chessBoard[kingPositionX][secondNextKingPositionY]
        )
            return false;

        if (!kingSideCastle && this.chessBoard[kingPositionX][1]) return false;

        return (
            this.isPositionSafeAfterMove(kingPositionX, kingPositionY, kingPositionX, firstNextKingPositionY) &&
            this.isPositionSafeAfterMove(kingPositionX, kingPositionY, kingPositionX, secondNextKingPositionY)
        );
    }

    public move(prevX: number, prevY: number, newX: number, newY: number, promotedPieceType: Fen | null): void {
        if (this._isGameOver) throw new Error("Game is over, you cant play move");

        if (!this.areCoordsValid({ x: prevX, y: prevY }) || !this.areCoordsValid({ x: newX, y: newY })) return;
        const piece: Piece | null = this.chessBoard[prevX][prevY];
        if (!piece || piece.color !== this._playerColor) return;

        const pieceSafeSquares: Coords[] | undefined = this._safeSquares.get(prevX + "," + prevY);
        if (!pieceSafeSquares || !pieceSafeSquares.find((coords) => coords.x === newX && coords.y === newY))
            throw new Error("Square is not safe");

        if ((piece instanceof Pawn || piece instanceof King || piece instanceof Rook) && !piece.hasMoved)
            piece.hasMoved = true;

        const moveType = new Set<MoveType>();

        const isPieceTaken: boolean = this.chessBoard[newX][newY] !== null;
        if (isPieceTaken) moveType.add(MoveType.CAPTURE);

        if (piece instanceof Pawn || isPieceTaken) this._fiftyMoveRuleCounter = 0;
        else this._fiftyMoveRuleCounter += 0.5;

        this.handlingSpecialMoves(piece, prevX, prevY, newX, newY, moveType);

        if (promotedPieceType) {
            this.chessBoard[newX][newY] = this.promotedPiece(promotedPieceType);
            moveType.add(MoveType.PROMOTE);
        } else {
            this.chessBoard[newX][newY] = piece;
        }

        this.chessBoard[prevX][prevY] = null;

        this._lastMove = { prevX, prevY, currX: newX, currY: newY, piece, moveType };
        this._playerColor = this._playerColor === Color.WHITE ? Color.BLACK : Color.WHITE;
        this.isInCheck(this._playerColor, true);
        const safeSquares: SafeSquares = this.findSafeSqures();

        if (this._checkState.isInCheck) moveType.add(!safeSquares.size ? MoveType.MATE : MoveType.CHECK);
        else if (!moveType.size) moveType.add(MoveType.MOVE);

        this.storeMove(promotedPieceType);
        this.updateGameHistory();

        this._safeSquares = safeSquares;
        if (this._playerColor === Color.WHITE) this.fullNumberOfMoves++;
        this._boardAsFEN = this.fenConverter.convertBoardToFEN(
            this.chessBoard,
            this._playerColor,
            this._lastMove,
            this._fiftyMoveRuleCounter,
            this.fullNumberOfMoves,
        );
        this.updateThreeFoldRepetitionDictionary(this._boardAsFEN);

        this._isGameOver = this.isGameFinished();
    }

    private handlingSpecialMoves(
        piece: Piece,
        prevX: number,
        prevY: number,
        newX: number,
        newY: number,
        moveType: Set<MoveType>,
    ): void {
        if (piece instanceof King && Math.abs(newY - prevY) === 2) {
            // newY > prevY  === king side castle

            const rookPositionX: number = prevX;
            const rookPositionY: number = newY > prevY ? 7 : 0;
            const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
            const rookNewPositionY: number = newY > prevY ? 5 : 3;
            this.chessBoard[rookPositionX][rookPositionY] = null;
            this.chessBoard[rookPositionX][rookNewPositionY] = rook;
            rook.hasMoved = true;
            moveType.add(MoveType.CASTLE);
        } else if (
            piece instanceof Pawn &&
            this._lastMove &&
            this._lastMove.piece instanceof Pawn &&
            Math.abs(this._lastMove.currX - this._lastMove.prevX) === 2 &&
            prevX === this._lastMove.currX &&
            newY === this._lastMove.currY
        ) {
            this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null;
            moveType.add(MoveType.CAPTURE);
        }
    }

    private promotedPiece(promtoedPieceType: Fen): Knight | Bishop | Rook | Queen {
        if (promtoedPieceType === Fen.WHITE_KNIGHT || promtoedPieceType === Fen.BLACK_KNIGHT)
            return new Knight(this._playerColor);

        if (promtoedPieceType === Fen.WHITE_BISHOP || promtoedPieceType === Fen.BLACK_BISHOP)
            return new Bishop(this._playerColor);

        if (promtoedPieceType === Fen.WHITE_ROOK || promtoedPieceType === Fen.BLACK_ROOK)
            return new Rook(this._playerColor);

        return new Queen(this._playerColor);
    }

    private isGameFinished(): boolean {
        if (this.insufficientMaterial()) {
            this._gameOverMessage = "Draw due insufficient material";
            return true;
        }

        if (!this._safeSquares.size) {
            if (this._checkState.isInCheck) {
                const prevPlayer: string = this._playerColor === Color.WHITE ? "Black" : "White";
                this._gameOverMessage = prevPlayer + " won by checkmate";
                this._isMate = true;
            } else this._gameOverMessage = "Stalemate";

            return true;
        }

        if (this.threeFoldRepetitionFlag) {
            this._gameOverMessage = "Draw due three fold repetition rule";
            return true;
        }

        if (this._fiftyMoveRuleCounter === 50) {
            this._gameOverMessage = "Draw due fifty move rule";
            return true;
        }

        return false;
    }

    // Insufficient material

    private playerHasOnlyTwoKnightsAndKing(pieces: { piece: Piece; x: number; y: number }[]): boolean {
        return pieces.filter((piece) => piece.piece instanceof Knight).length === 2;
    }

    private playerHasOnlyBishopsWithSameColorAndKing(pieces: { piece: Piece; x: number; y: number }[]): boolean {
        const bishops = pieces.filter((piece) => piece.piece instanceof Bishop);
        const areAllBishopsOfSameColor =
            new Set(bishops.map((bishop) => ChessBoard.isSquareDark({ x: bishop.x, y: bishop.y }))).size === 1;
        return bishops.length === pieces.length - 1 && areAllBishopsOfSameColor;
    }

    private insufficientMaterial(): boolean {
        const whitePieces: { piece: Piece; x: number; y: number }[] = [];
        const blackPieces: { piece: Piece; x: number; y: number }[] = [];

        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece) continue;

                if (piece.color === Color.WHITE) whitePieces.push({ piece, x, y });
                else blackPieces.push({ piece, x, y });
            }
        }

        // King vs King
        if (whitePieces.length === 1 && blackPieces.length === 1) return true;

        // King and Minor Piece vs King
        if (whitePieces.length === 1 && blackPieces.length === 2)
            return blackPieces.some((piece) => piece.piece instanceof Knight || piece.piece instanceof Bishop);
        else if (whitePieces.length === 2 && blackPieces.length === 1)
            return whitePieces.some((piece) => piece.piece instanceof Knight || piece.piece instanceof Bishop);
        // both sides have bishop of same color
        else if (whitePieces.length === 2 && blackPieces.length === 2) {
            const WHITE_BISHOP = whitePieces.find((piece) => piece.piece instanceof Bishop);
            const BLACK_BISHOP = blackPieces.find((piece) => piece.piece instanceof Bishop);

            if (WHITE_BISHOP && BLACK_BISHOP) {
                const areBishopsOfSameColor: boolean =
                    (ChessBoard.isSquareDark({ x: WHITE_BISHOP.x, y: WHITE_BISHOP.y }) &&
                        ChessBoard.isSquareDark({ x: BLACK_BISHOP.x, y: BLACK_BISHOP.y })) ||
                    (!ChessBoard.isSquareDark({ x: WHITE_BISHOP.x, y: WHITE_BISHOP.y }) &&
                        !ChessBoard.isSquareDark({ x: BLACK_BISHOP.x, y: BLACK_BISHOP.y }));

                return areBishopsOfSameColor;
            }
        }

        if (
            (whitePieces.length === 3 &&
                blackPieces.length === 1 &&
                this.playerHasOnlyTwoKnightsAndKing(whitePieces)) ||
            (whitePieces.length === 1 && blackPieces.length === 3 && this.playerHasOnlyTwoKnightsAndKing(blackPieces))
        )
            return true;

        if (
            (whitePieces.length >= 3 &&
                blackPieces.length === 1 &&
                this.playerHasOnlyBishopsWithSameColorAndKing(whitePieces)) ||
            (whitePieces.length === 1 &&
                blackPieces.length >= 3 &&
                this.playerHasOnlyBishopsWithSameColorAndKing(blackPieces))
        )
            return true;

        return false;
    }

    private updateThreeFoldRepetitionDictionary(FEN: string): void {
        const threeFoldRepetitionFENKey: string = FEN.split(" ").slice(0, 4).join("");
        const threeFoldRepetionValue: number | undefined =
            this.threeFoldRepetitionDictionary.get(threeFoldRepetitionFENKey);

        if (threeFoldRepetionValue === undefined) this.threeFoldRepetitionDictionary.set(threeFoldRepetitionFENKey, 1);
        else {
            if (threeFoldRepetionValue === 2) {
                this.threeFoldRepetitionFlag = true;
                return;
            }
            this.threeFoldRepetitionDictionary.set(threeFoldRepetitionFENKey, 2);
        }
    }

    private storeMove(promotedPiece: Fen | null): void {
        const { piece, currX, currY, prevY, moveType } = this._lastMove!;
        const pieceName: string = !(piece instanceof Pawn) ? piece.fen.toUpperCase() : "";
        let move: string;

        if (moveType.has(MoveType.CASTLE)) move = currY - prevY === 2 ? "O-O" : "O-O-O";
        else {
            move = pieceName + this.startingPieceCoordsNotation();
            if (moveType.has(MoveType.CAPTURE)) move += piece instanceof Pawn ? COLUMNS[prevY] + "x" : "x";
            move += COLUMNS[currY] + String(currX + 1);

            if (promotedPiece) move += "=" + promotedPiece.toUpperCase();
        }

        if (moveType.has(MoveType.CHECK)) move += "+";
        else if (moveType.has(MoveType.MATE)) move += "#";

        if (!this._moveList[this.fullNumberOfMoves - 1]) this._moveList[this.fullNumberOfMoves - 1] = [move];
        else this._moveList[this.fullNumberOfMoves - 1].push(move);
    }

    private startingPieceCoordsNotation(): string {
        const { piece: currPiece, prevX, prevY, currX, currY } = this._lastMove!;
        if (currPiece instanceof Pawn || currPiece instanceof King) return "";

        const samePiecesCoords: Coords[] = [{ x: prevX, y: prevY }];

        for (let x = 0; x < this.chessBoardSize; x++) {
            for (let y = 0; y < this.chessBoardSize; y++) {
                const piece: Piece | null = this.chessBoard[x][y];
                if (!piece || (currX === x && currY === y)) continue;

                if (piece.fen === currPiece.fen) {
                    const safeSquares: Coords[] = this._safeSquares.get(x + "," + y) || [];
                    const pieceHasSameTargetSquare: boolean = safeSquares.some(
                        (coords) => coords.x === currX && coords.y === currY,
                    );
                    if (pieceHasSameTargetSquare) samePiecesCoords.push({ x, y });
                }
            }
        }

        if (samePiecesCoords.length === 1) return "";

        const piecesFile = new Set(samePiecesCoords.map((coords) => coords.y));
        const piecesRank = new Set(samePiecesCoords.map((coords) => coords.x));

        // means that all of the pieces are on different files (a, b, c, ...)
        if (piecesFile.size === samePiecesCoords.length) return COLUMNS[prevY];

        // means that all of the pieces are on different rank (1, 2, 3, ...)
        if (piecesRank.size === samePiecesCoords.length) return String(prevX + 1);

        // in case that there are pieces that shares both rank and a file with multiple or one piece
        return COLUMNS[prevY] + String(prevX + 1);
    }

    private updateGameHistory(): void {
        this._gameHistory.push({
            board: [...this.chessBoardView.map((row) => [...row])],
            checkState: { ...this._checkState },
            lastMove: this._lastMove ? { ...this._lastMove } : undefined,
        });
    }

    public getPieceAt(coords: Coords): Piece | null {
        return this.chessBoard[coords.x][coords.y];
    }

    public parseSafeSquareFrom(from: string): Coords {
        const [x, y] = from.split(",");
        return { x: Number(x), y: Number(y) };
    }

    public willMoveBePromotion(fen: Fen, to: Coords): boolean {
        return (fen === Fen.WHITE_PAWN || fen === Fen.BLACK_PAWN) && (to.x === 0 || to.x === 7);
    }
}
