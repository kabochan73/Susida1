import { formatTime } from '@/lib/format';

export default function Timer({ remainingMs }: { remainingMs: number }) {
    return (
        <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500">
                Time left
            </p>
            <p className="text-4xl font-bold tabular-nums">
                {formatTime(remainingMs)}
            </p>
        </div>
    );
}
