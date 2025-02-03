import { COLUMNS, ROWS } from "@/game/chess/const";
import { Color, Coords, Fen } from "@/game/chess/type";

const stockfish = new Worker("./engine/stockfish.wasm.js");

export type EngineMove = { from: Coords; to: Coords; promotion?: Fen };
export type EngineMateIn = { moves: number; color: Color };

type EngineMessage = {
    /** stockfish engine message in UCI format*/
    uciMessage: string;
    /** found best move for current position */
    bestMove?: EngineMove;
    /** found best move for opponent */
    ponder?: EngineMove;
    /** evaluation for the current turn player */
    positionEvaluation?: number;
    /** count of moves until mate */
    mateIn?: EngineMateIn;
    /** the best line found */
    bestLine?: EngineMove[];
    /** number of halfmoves the engine looks ahead */
    depth?: number;
};

export default class StockfishEngine {
    stockfish: Worker;
    onMessage: (callback: (messageData: EngineMessage) => void) => void;
    isReady: boolean;

    constructor() {
        this.stockfish = stockfish;
        this.isReady = false;
        this.onMessage = (callback) => {
            this.stockfish.addEventListener("message", (e) => {
                callback(this.transformSFMessageData(e));
            });
        };
        this.init();
    }

    private parseMove(uciMove?: string): EngineMove | undefined {
        if (!uciMove) return undefined;

        const from = uciMove.slice(0, 2);
        const to = uciMove.slice(2, 4);
        const promotion = uciMove.slice(4, 5) as Fen;

        return {
            from: {
                x: ROWS.indexOf(from[1] as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"),
                y: COLUMNS.indexOf(from[0] as "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"),
            },
            to: {
                x: ROWS.indexOf(to[1] as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"),
                y: COLUMNS.indexOf(to[0] as "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"),
            },
            promotion,
        };
    }

    private parseMateIn(mateIn?: string): EngineMateIn | undefined {
        if (!mateIn) return undefined;

        if (mateIn.includes("-")) return { moves: Math.abs(Number(mateIn)), color: Color.BLACK };
        else return { moves: Math.abs(Number(mateIn)), color: Color.WHITE };
    }

    private parseEvaluation(evaluation?: string): number | undefined {
        if (!evaluation) return undefined;

        return Number(evaluation) / 100;
    }

    private parseBestLine(bestLine?: string): EngineMove[] | undefined {
        if (!bestLine) return undefined;

        return bestLine
            .split(" ")
            .map(this.parseMove)
            .filter((elem) => elem !== undefined);
    }

    private transformSFMessageData(e: MessageEvent): EngineMessage {
        const uciMessage = e?.data ?? e;

        return {
            uciMessage,
            bestMove: this.parseMove(uciMessage.match(/bestmove\s+(\S+)/)?.[1]),
            ponder: this.parseMove(uciMessage.match(/ponder\s+(\S+)/)?.[1]),
            positionEvaluation: this.parseEvaluation(uciMessage.match(/cp\s+(\S+)/)?.[1]),
            mateIn: this.parseMateIn(uciMessage.match(/mate\s+(\S+)/)?.[1]),
            bestLine: this.parseBestLine(uciMessage.match(/ pv\s+(.*)/)?.[1]),
            depth: Number(uciMessage.match(/ depth\s+(\S+)/)?.[1]) ?? 0,
        };
    }

    init() {
        this.stockfish.postMessage("uci");
        this.stockfish.postMessage("isready");
        this.onMessage(({ uciMessage }) => {
            if (uciMessage === "readyok") this.isReady = true;
        });
    }

    onReady(callback: () => void) {
        this.onMessage(({ uciMessage }) => {
            if (uciMessage === "readyok") callback();
        });
    }

    evaluatePosition(fen: string, depth: number = 12) {
        if (depth > 24) depth = 24;

        // Skill Level Elo
        // 0    1347
        // 1    1490
        // 2    1597
        // 3    1694
        // 4    1785
        // 5    1871
        // 6    1954
        // 7    2035
        // 8    2113
        // 9    2189
        // 10   2264
        // 11   2337
        // 12   2409
        // 13   2480
        // 14   2550
        // 15   2619
        // 16   2686
        // 17   2754
        // 18   2820
        // 19   2886

        this.stockfish.postMessage("setoption name Skill Level value 0");
        this.stockfish.postMessage(`position fen ${fen}`);
        this.stockfish.postMessage(`go depth ${depth}`);
    }

    stop() {
        this.stockfish.postMessage("stop"); // Run when searching takes too long time and stockfish will return you the bestmove of the deep it has reached
    }

    terminate() {
        this.isReady = false;
        this.stockfish.postMessage("quit"); // Run this before chessboard unmounting.
    }
}
