"use client";
import { Coords } from "@/game/chess/type";
import { PropsWithChildren, createContext, useContext, useEffect, useRef } from "react";

export enum Event {
    SCORE_PIECE = "SCORE_PIECE",
}

export interface EventDataMap {
    [Event.SCORE_PIECE]: { coords: Coords };
}

type Props = {};
type EventState = {
    emit: <E extends Event>(event: E, data: EventDataMap[E]) => void;
    on: <E extends Event>(event: E, callback: (data: EventDataMap[E]) => void) => void;
};

export const EventContext = createContext<EventState>({
    emit: () => {},
    on: () => {},
});

const EventProvider = ({ children }: PropsWithChildren<Props>) => {
    const events = useRef<Record<Event, ((data: any) => void)[]>>({
        [Event.SCORE_PIECE]: [],
    });

    const handlers = useRef({
        sub: <E extends Event>(event: E, callback: (data: EventDataMap[E]) => void) => {
            events.current[event].push(callback);
        },

        unsub: <E extends Event>(event: E, callback: (data: EventDataMap[E]) => void) => {
            const callbacks = events.current[event];
            for (var i = 0; i < callbacks.length; i++) {
                if (callbacks[i] === callback) {
                    callbacks.splice(i, 1);
                    break;
                }
            }
        },

        emit: <E extends Event>(event: E, data: EventDataMap[E]) => {
            events.current[event]?.forEach((callback) => {
                callback(data);
            });
        },
    });

    const on = <E extends Event>(event: E, callback: (data: EventDataMap[E]) => void) => {
        useEffect(() => {
            handlers.current.sub(event, callback);
            return () => handlers.current.unsub(event, callback);
        }, [event, callback]);
    };

    return <EventContext.Provider value={{ emit: handlers.current.emit, on }}>{children}</EventContext.Provider>;
};

function useEvent() {
    const context = useContext(EventContext);
    if (context === undefined) throw new Error("useEvent must be used within a EventProvider");
    return context;
}

export { EventProvider, useEvent };
