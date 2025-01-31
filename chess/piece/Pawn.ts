import { Piece } from "@/chess/piece/Piece";
import { Base, Color, Coords, Fen, Material } from "@/chess/type";

export class Pawn extends Piece {
    private _hasMoved: boolean = false;
    protected override _fen: Fen;
    protected override _directions: Coords[] = [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
    ];

    constructor(
        private pieceColor: Color,
        private pieceMaterial: Material,
        private pieceBase: Base,
    ) {
        super(pieceColor, pieceMaterial, pieceBase);
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
        const newPawn = new Pawn(this.color, this.material, this.base);
        if (this._hasMoved) newPawn.hasMoved = true;
        return newPawn;
    }

    public override serialize(): string {
        return JSON.stringify({
            fen: this.fen,
            material: this.material,
            base: this.base,
            hasMoved: this._hasMoved,
        });
    }

    public override deserialize(serialized: string): Piece {
        const { fen, material, base, hasMoved } = JSON.parse(serialized);
        const newPawn = new Pawn(fen === Fen.WHITE_PAWN ? Color.WHITE : Color.BLACK, material, base);
        if (hasMoved) newPawn.hasMoved = true;
        return newPawn;
    }
}
