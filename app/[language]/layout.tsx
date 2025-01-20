import { Language } from '@/locale/language';
import type { Metadata } from 'next';
import { Kode_Mono as Kode } from 'next/font/google';
import { ReactNode } from 'react';
import '../globals.css';

const kode = Kode({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700']
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
    title: 'Forked'
};

const RootLayout = async ({ children, params }: Readonly<LayoutProps>) => {
    const { language } = await params;

    return (
        <html
            lang={language}
            className="h-dvh max-h-dvh min-h-dvh w-dvw max-w-dvw min-w-dvw overflow-hidden bg-trout-700 text-white"
        >
            <body className={`${kode.className} size-full overflow-hidden`}>{children}</body>
        </html>
    );
};

export default RootLayout;
