import { GameState } from '@/lib/judge';
import HintText from './HintText';
import QuestionCounter from './QuestionCounter';
import Timer from './Timer';

export default function TypingGame({ state }: { state: GameState }) {
    const typed = state.currentWord.word.slice(0, state.typedLength);
    const rest = state.currentWord.word.slice(state.typedLength);

    return (
        <div className="mx-auto max-w-md px-6 py-10 text-center">
            <div className="flex items-center justify-between">
                <QuestionCounter questionsShown={state.questionsShown} />
                <Timer remainingMs={state.remainingMs} />
            </div>

            <p className="mt-10 text-sm uppercase tracking-widest text-gray-500">
                Meaning
            </p>
            <p className="mt-2 text-4xl font-bold">
                {state.currentWord.meaning}
            </p>

            {state.mode === 'practice' && (
                <HintText word={state.currentWord.word} />
            )}

            <p className="mt-6 text-2xl tracking-widest">
                <span className="text-green-600">{typed}</span>
                <span className="text-gray-400">{rest}</span>
            </p>
        </div>
    );
}
