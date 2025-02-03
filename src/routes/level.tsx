import { createFileRoute } from "@tanstack/react-router";

const Level = async () => {
    return <div className="relative h-full w-full p-6"></div>;
};

export const Route = createFileRoute("/level")({
    component: Level,
});
