import { Language } from "@/locale/language";
import JotaiProvider from "@/provider/JotaiProvider";
import type { Metadata } from "next";
import { Kode_Mono as Kode } from "next/font/google";
import { ReactNode } from "react";
import "../globals.css";

const kode = Kode({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export interface PageProps {
    params: Promise<{ language: Language }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface LayoutProps {
    params: Promise<{ language: Language }>;
    children: ReactNode;
}

export const metadata: Metadata = {
    title: "Forked",
};

const RootLayout = async ({ children, params }: Readonly<LayoutProps>) => {
    const { language } = await params;

    return (
        <html
            lang={language}
            className="bg-trout-700 h-dvh max-h-dvh min-h-dvh w-dvw max-w-dvw min-w-dvw touch-none overflow-hidden text-white"
            suppressHydrationWarning
        >
            <body className={`${kode.className} relative size-full overflow-hidden`}>
                <JotaiProvider>{children}</JotaiProvider>
            </body>
        </html>
    );
};

export default RootLayout;
