import { Mode } from '@/lib/judge';
import { Grade } from '@/lib/words';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function ResultScreen({
    grade,
    mode,
    score,
}: {
    grade: Grade;
    mode: Mode;
    score: number;
}) {
    const { auth } = usePage<PageProps>().props;
    const [saveState, setSaveState] = useState<SaveState>('idle');

    const save = () => {
        setSaveState('saving');
        axios
            .post('/game-sessions', { grade, score })
            .then(() => setSaveState('saved'))
            .catch(() => setSaveState('error'));
    };

    useEffect(() => {
        if (mode === 'challenge' && auth.user) {
            save();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mx-auto max-w-md px-6 py-16 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500">
                Result
            </p>
            <p className="mt-2 text-5xl font-bold">{score}</p>
            <p className="mt-1 text-gray-500">問正解</p>

            {mode === 'practice' && (
                <p className="mt-6 text-sm text-gray-600">
                    チャレンジモードで挑戦するとランキングに参加できます
                </p>
            )}

            {mode === 'challenge' && !auth.user && (
                <p className="mt-6 text-sm text-gray-600">
                    <Link href="/login" className="underline">
                        ログイン
                    </Link>
                    するとランキングに記録されます
                </p>
            )}

            {mode === 'challenge' && auth.user && saveState === 'saved' && (
                <p className="mt-6 text-sm text-gray-600">
                    <Link href="/" className="underline">
                        ランキングを見る
                    </Link>
                </p>
            )}

            {mode === 'challenge' && auth.user && saveState === 'error' && (
                <button
                    type="button"
                    onClick={save}
                    className="mt-6 text-sm text-red-600 underline"
                >
                    保存に失敗しました。再試行する
                </button>
            )}

            <div className="mt-8">
                <Link href="/" className="text-sm text-gray-500 underline">
                    トップに戻る
                </Link>
            </div>
        </div>
    );
}
