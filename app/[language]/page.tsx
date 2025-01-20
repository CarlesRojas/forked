import { PageProps } from '@/app/[language]/layout';
import { getTranslation } from '@/locale/getTranslation';

const Home = async ({ params }: PageProps) => {
    const { language } = await params;
    const t = getTranslation(language);
    console.log(t);

    return <main className="size-full flex items-center justify-center text-3xl">Forked</main>;
};

export default Home;
