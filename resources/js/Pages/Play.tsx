import Countdown from '@/Components/game/Countdown';
import ResultScreen from '@/Components/game/ResultScreen';
import TypingGame from '@/Components/game/TypingGame';
import { useGameLoop } from '@/hooks/useGameLoop';
import { Mode } from '@/lib/judge';
import { Grade, isValidGrade } from '@/lib/words';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Play({ grade, mode }: { grade: string; mode: Mode }) {
    // バックエンドはgradeの値一覧を持たないため(docs/02-decisions-log.md)、
    // フロントエンドで実在する級かどうかをここで確認する。
    useEffect(() => {
        if (!isValidGrade(grade)) {
            router.visit('/');
        }
    }, [grade]);

    if (!isValidGrade(grade)) {
        return null;
    }

    return <PlayGame grade={grade} mode={mode} />;
}

function PlayGame({ grade, mode }: { grade: Grade; mode: Mode }) {
    const { state, onKeyInput, countdown } = useGameLoop(grade, mode);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                onKeyInput(e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onKeyInput]);

    return (
        <>
            <Head title="Play" />
            {state.status === 'finished' ? (
                <ResultScreen grade={grade} mode={mode} score={state.score} />
            ) : state.status === 'idle' ? (
                <Countdown grade={grade} countdown={countdown} />
            ) : (
                <TypingGame state={state} />
            )}
        </>
    );
}
