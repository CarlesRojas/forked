// export class StockfishEngine {
//     private stockfish: Worker;

import { COLUMNS, ROWS } from "@/chess/const";
import { Coords, Fen } from "@/chess/type";

//     constructor() {
//         this.stockfish = new Worker("./engine/stockfish.js");
//         this.stockfish.addEventListener("message", this.onMessage);
//     }

//     public destroy() {
//         this.stockfish.removeEventListener("message", this.onMessage);
//         this.stockfish.terminate();
//     }

//     private onMessage = (e: MessageEvent) => {
//         const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];

//         console.log(bestMove);
//     };

//     evaluatePosition(fen: string, depth: number) {
//         this.stockfish.postMessage(`position fen ${fen}`);
//         this.stockfish.postMessage(`go depth ${depth}`);
//     }
// }

const stockfish = new Worker("./engine/stockfish.wasm.js");

export type EngineMove = { from: Coords; to: Coords; promotion?: Fen };

type EngineMessage = {
    /** stockfish engine message in UCI format*/
    uciMessage: string;
    /** found best move for current position in format `e2e4`*/
    bestMove?: EngineMove;
    /** found best move for opponent in format `e7e5` */
    ponder?: string;
    /**  material balance's difference in centipawns(IMPORTANT! stockfish gives the cp score in terms of whose turn it is)*/
    positionEvaluation?: string;
    /** count of moves until mate */
    possibleMate?: string;
    /** the best line found */
    pv?: string;
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

    private uciMoveToCoords(uciMove?: string): EngineMove | undefined {
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

    private transformSFMessageData(e: MessageEvent): EngineMessage {
        const uciMessage = e?.data ?? e;

        return {
            uciMessage,
            bestMove: this.uciMoveToCoords(uciMessage.match(/bestmove\s+(\S+)/)?.[1]),
            ponder: uciMessage.match(/ponder\s+(\S+)/)?.[1],
            positionEvaluation: uciMessage.match(/cp\s+(\S+)/)?.[1],
            possibleMate: uciMessage.match(/mate\s+(\S+)/)?.[1],
            pv: uciMessage.match(/ pv\s+(.*)/)?.[1],
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
