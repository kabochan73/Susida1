export type RankingEntry = { rank: number; name: string; bestScore: number };

export default function RankingSidebar({
    ranking,
}: {
    ranking: RankingEntry[];
}) {
    return (
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
    );
}
