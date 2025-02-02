import { useEffect, useRef } from "react";

import { MAX_ENGINE_THINK_TIME } from "@/game/chess/const";
import StockfishEngine, { EngineMateIn, EngineMove } from "@/game/chess/stockfish/StockfishEngine";
import { Color } from "@/game/chess/type";
import { useMemo, useState } from "react";

export interface EvaluateProps {
    fen: string;
    isGameOver: boolean;
    turn: Color;
}

export const useStockfish = () => {
    const engine = useMemo(() => new StockfishEngine(), []);
    const [isReady, setIsReady] = useState(false);

    const [evaluation, setEvaluation] = useState(0);
    const [depth, setDepth] = useState(10);
    const [bestLine, setBestline] = useState<EngineMove[]>([]);
    const [mateIn, setMateIn] = useState<EngineMateIn>();
    const [bestMove, setBestMove] = useState<EngineMove>();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        engine.onReady(() => setIsReady(true));

        return () => {
            engine.terminate();
        };
    }, [engine]);

    const evaluate = ({ fen, isGameOver, turn }: EvaluateProps) => {
        if (!isReady || isGameOver) return;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setDepth(10);
        setBestline([]);
        setBestMove(undefined);

        engine.evaluatePosition(fen, 18);

        engine.onMessage(({ positionEvaluation, mateIn, bestLine, depth, bestMove }) => {
            if (depth && depth < 10) return;

            if (positionEvaluation) setEvaluation((turn === Color.WHITE ? 1 : -1) * positionEvaluation);
            if (mateIn) setMateIn(mateIn);
            if (depth) setDepth(depth);
            if (bestLine) setBestline(bestLine);
            if (bestMove) setBestMove(bestMove);
        });

        timeoutRef.current = setTimeout(() => {
            engine.stop();
        }, MAX_ENGINE_THINK_TIME);
    };

    return { evaluate, evaluation, depth, bestLine, mateIn, bestMove, isReady };
};
