import { Piece } from "@/chess/piece/Piece";
import { Color, Coords, Fen } from "@/chess/type";

export class Pawn extends Piece {
    private _hasMoved: boolean = false;
    protected override _fen: Fen;
    protected override _directions: Coords[] = [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
    ];

    constructor(private pieceColor: Color) {
        super(pieceColor);
        if (pieceColor === Color.BLACK) this.setBlackPawnDirections();
        this._fen = pieceColor === Color.WHITE ? Fen.WHITE_PAWN : Fen.BLACK_PAWN;
    }

    private setBlackPawnDirections(): void {
        this._directions = this._directions.map(({ x, y }) => ({ x: -1 * x, y }));
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    public set hasMoved(_) {
        this._hasMoved = true;
        this._directions = [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: -1 },
        ];
        if (this.pieceColor === Color.BLACK) this.setBlackPawnDirections();
    }

    public override clone(): Piece {
        const newPawn = new Pawn(this.color);
        if (this._hasMoved) newPawn.hasMoved = true;
        return newPawn;
    }
}
