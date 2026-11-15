import { GameState } from '@/lib/judge';
import { GRADE_LABELS } from '@/lib/words';
import { Link } from '@inertiajs/react';
import HintText from './HintText';
import QuestionCounter from './QuestionCounter';
import Timer from './Timer';

export default function TypingGame({ state }: { state: GameState }) {
    const typed = state.currentWord.word.slice(0, state.typedLength);
    const rest = state.currentWord.word.slice(state.typedLength);

    return (
        <div>
            <div className="flex w-full items-center justify-between border-b border-gray-700 px-12 py-4">
                <Link href="/" className="text-2xl font-bold tracking-widest">
                    WORD LEARNER
                </Link>
                <p className="text-lg text-gray-500">
                    {GRADE_LABELS[state.grade]}
                </p>
            </div>

            <div className="mx-auto max-w-xl px-6 py-10 text-center">
                <Timer remainingMs={state.remainingMs} />

                <hr className="my-8 border-gray-200" />

                <QuestionCounter questionsShown={state.questionsShown} />
                <p className="mt-4 text-4xl font-bold">
                    {state.currentWord.meaning}
                </p>

                {state.mode === 'practice' && (
                    <HintText word={state.currentWord.word} />
                )}

                <div className="mt-8 border-b-2 border-gray-900 pb-2">
                    <p className="text-2xl tracking-widest">
                        <span className="text-green-600">{typed}</span>
                        <span className="text-gray-400">{rest}</span>
                    </p>
                </div>
                <p className="mt-2 text-xs uppercase tracking-widest text-gray-500">
                    Type the word
                </p>
            </div>
        </div>
    );
}
