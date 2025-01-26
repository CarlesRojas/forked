import { useEffect, useRef } from "react";

import { MAX_ENGINE_THINK_TIME } from "@/chess/const";
import StockfishEngine from "@/chess/stockfish/StockfishEngine";
import { Color, Coords, Fen } from "@/chess/type";
import { useMemo, useState } from "react";

interface Props {
    fen: string;
    isGameOver: boolean;
    turn: Color;
}

export const useStockfish = () => {
    const engine = useMemo(() => new StockfishEngine(), []);
    const [isReady, setIsReady] = useState(false);

    const [evaluation, setEvaluation] = useState(0);
    const [depth, setDepth] = useState(10);
    const [bestLine, setBestline] = useState("");
    const [possibleMate, setPossibleMate] = useState("");
    const [bestMove, setBestMove] = useState<{ from: Coords; to: Coords; promotion?: Fen }>();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        engine.onReady(() => setIsReady(true));

        return () => {
            engine.terminate();
        };
    }, [engine]);

    const evaluate = ({ fen, isGameOver, turn }: Props) => {
        if (!isReady || isGameOver) return;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setDepth(10);
        setBestline("");
        setPossibleMate("");
        setBestMove(undefined);

        engine.evaluatePosition(fen, 18);

        engine.onMessage(({ positionEvaluation, possibleMate, pv, depth, bestMove }) => {
            if (depth && depth < 10) return;

            if (positionEvaluation) setEvaluation(((turn === Color.WHITE ? 1 : -1) * Number(positionEvaluation)) / 100);
            if (possibleMate) setPossibleMate(possibleMate);
            if (depth) setDepth(depth);
            if (pv) setBestline(pv);
            if (bestMove) setBestMove(bestMove);
        });

        timeoutRef.current = setTimeout(() => {
            engine.stop();
        }, MAX_ENGINE_THINK_TIME);
    };

    return { evaluate, evaluation, depth, bestLine, possibleMate, bestMove };
};
