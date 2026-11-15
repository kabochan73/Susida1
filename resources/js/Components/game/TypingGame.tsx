import { GRADE_LABELS } from '@/lib/customize/words';
import { GameState } from '@/lib/judge';
import { Link } from '@inertiajs/react';
import Timer from './Timer';

export default function TypingGame({ state }: { state: GameState }) {
    const typed = state.currentWord.word.slice(0, state.typedLength);
    const rest = state.currentWord.word.slice(state.typedLength);

    return (
        <div>
            <div className="flex w-full items-center justify-between border-b-2 border-gray-700 px-12 py-4">
                <Link href="/" className="text-2xl font-bold tracking-widest">
                    WORD LEARNER
                </Link>
                <p className="text-xl">{GRADE_LABELS[state.grade]}</p>
            </div>

            <div className="mx-auto max-w-xl px-6 py-10 text-center">
                <Timer remainingMs={state.remainingMs} />

                <hr className="my-8 border-b border-gray-400" />

                <p className="mt-6 text-4xl font-bold">
                    {state.currentWord.meaning}
                </p>

                <div className="mt-8">
                    <p className="text-3xl font-bold tracking-widest">
                        <span className="text-green-600">{typed}</span>
                        {state.mode === 'practice' && (
                            <span className="text-gray-400">{rest}</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
