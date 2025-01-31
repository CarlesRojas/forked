import { Base, Color, Coords, Fen, Material } from "@/chess/type";

export abstract class Piece {
    protected abstract _fen: Fen;
    protected abstract _directions: Coords[];

    constructor(
        private _color: Color,
        private _material: Material,
        private _base: Base,
    ) {}

    public get fen(): Fen {
        return this._fen;
    }

    public get directions(): Coords[] {
        return this._directions;
    }

    public get color(): Color {
        return this._color;
    }

    public get material(): Material {
        return this._material;
    }

    public get base(): Base {
        return this._base;
    }

    public set material(material: Material) {
        this._material = material;
    }

    public set base(base: Base) {
        this._base = base;
    }

    public abstract clone(): Piece;

    public abstract serialize(): string;

    public abstract deserialize(serialized: string): Piece;
}
