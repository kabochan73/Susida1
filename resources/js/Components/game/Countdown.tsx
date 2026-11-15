import { GRADE_LABELS, Grade } from '@/lib/words';
import { Link } from '@inertiajs/react';

export default function Countdown({
    grade,
    countdown,
}: {
    grade: Grade;
    countdown: number;
}) {
    return (
        <div>
            <div className="flex w-full items-center justify-between border-b border-gray-400 px-12 py-4">
                <Link href="/" className="text-2xl font-bold tracking-widest">
                    WORD LEARNER
                </Link>
                <p className="text-xl">{GRADE_LABELS[grade]}</p>
            </div>

            <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-xl uppercase tracking-widest text-gray-500">
                    Get ready
                </p>
                <p className="mt-4 text-7xl font-bold">{countdown}</p>
            </div>
        </div>
    );
}
