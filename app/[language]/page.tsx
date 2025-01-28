import { PageProps } from "@/app/[language]/layout";
import { Button } from "@/component/ui/button";
import { getTranslation } from "@/locale/getTranslation";
import Link from "next/link";

const MainMenu = async ({ params }: PageProps) => {
    const { language } = await params;
    const t = getTranslation(language);
    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 p-6">
            <h1 className="text-6xl font-semibold">{t.mainMenu.title}</h1>

            <Button asChild>
                <Link href={"/game"}>{t.mainMenu.play}</Link>
            </Button>
        </div>
    );
};

export default MainMenu;
