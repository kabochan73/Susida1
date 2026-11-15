export default function QuestionCounter({
    questionsShown,
}: {
    questionsShown: number;
}) {
    return (
        <p className="text-xs uppercase tracking-widest text-gray-500">
            Question {questionsShown.toString().padStart(2, '0')}
        </p>
    );
}
