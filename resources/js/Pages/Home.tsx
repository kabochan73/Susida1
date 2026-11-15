import LevelSelect from '@/Components/home/LevelSelect';
import ModeSelect from '@/Components/home/ModeSelect';
import StartGameButton from '@/Components/home/StartGameButton';
import { Mode } from '@/lib/judge';
import { Grade } from '@/lib/words';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type RankingEntry = { rank: number; name: string; bestScore: number };

export default function Home({
    grade,
    ranking,
}: {
    grade: Grade;
    ranking: RankingEntry[];
}) {
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

                <div>
                    <p className="text-sm uppercase tracking-widest text-gray-500">
                        Ranking
                    </p>
                    <h2 className="mt-2 text-xl font-bold">Top 10 players</h2>

                    {ranking.length === 0 ? (
                        <p className="mt-4 text-gray-500">
                            まだランキングがありません。最初のプレイヤーになろう!
                        </p>
                    ) : (
                        <ol className="mt-4 divide-y divide-gray-200">
                            {ranking.map((entry) => (
                                <li
                                    key={entry.rank}
                                    className="flex items-center justify-between py-3"
                                >
                                    <span>
                                        {entry.rank}. {entry.name}
                                    </span>
                                    <span>{entry.bestScore}</span>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </>
    );
}
