import { Grade } from '@/lib/words';

const GRADE_LABELS: Record<Grade, string> = {
    '5': '英検5級',
    '4': '英検4級',
    '3': '英検3級',
};

export default function LevelSelect({
    value,
    onChange,
}: {
    value: Grade;
    onChange: (grade: Grade) => void;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as Grade)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
            {(Object.keys(GRADE_LABELS) as Grade[]).map((grade) => (
                <option key={grade} value={grade}>
                    {GRADE_LABELS[grade]}
                </option>
            ))}
        </select>
    );
}
