import LevelSelect from '@/Components/home/LevelSelect';
import ModeSelect from '@/Components/home/ModeSelect';
import StartGameButton from '@/Components/home/StartGameButton';
import RankingSidebar, {
    RankingEntry,
} from '@/Components/ranking/RankingSidebar';
import { Mode } from '@/lib/judge';
import { Grade } from '@/lib/words';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Home({
    grade,
    ranking,
}: {
    grade: Grade;
    ranking: RankingEntry[];
}) {
    const { auth } = usePage<PageProps>().props;
    const [mode, setMode] = useState<Mode>('practice');

    const handleGradeChange = (nextGrade: Grade) => {
        router.reload({
            only: ['grade', 'ranking'],
            data: { grade: nextGrade },
        });
    };

    return (
        <>
            <Head title="Home" />

            {auth.user && (
                <div className="mx-auto max-w-5xl px-6 pt-6 text-right">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-sm text-gray-500 underline"
                    >
                        ログアウト
                    </Link>
                </div>
            )}

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 border-t px-6 py-10 lg:grid-cols-2">
                <div>
                    <p className="text-sm uppercase tracking-widest text-gray-500">
                        Let&apos;s learn English
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">
                        Words make you stronger.
                    </h1>
                    <p className="mt-2 text-gray-600">
                        タイピングで英単語を身につけよう。
                    </p>

                    <div className="mt-8">
                        <p className="text-sm uppercase tracking-widest text-gray-500">
                            Select level
                        </p>
                        <LevelSelect
                            value={grade}
                            onChange={handleGradeChange}
                        />
                    </div>

                    <div className="mt-6">
                        <p className="text-sm uppercase tracking-widest text-gray-500">
                            Select mode
                        </p>
                        <ModeSelect value={mode} onChange={setMode} />
                    </div>

                    <div className="mt-8">
                        <StartGameButton grade={grade} mode={mode} />
                    </div>
                </div>

                <RankingSidebar ranking={ranking} />
            </div>
        </>
    );
}
