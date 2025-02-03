import JotaiProvider from "@/provider/JotaiProvider";
import "@fontsource-variable/kode-mono";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <JotaiProvider>
            <Outlet />
        </JotaiProvider>
    );
}
