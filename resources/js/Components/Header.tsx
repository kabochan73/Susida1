import { User } from '@/types';
import { Link } from '@inertiajs/react';

export default function Header({ user }: { user: User | null }) {
    return (
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-6">
            <Link href="/" className="text-sm font-bold tracking-widest">
                WORD LEARNER
            </Link>

            {user ? (
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="text-sm text-gray-500 underline"
                >
                    ログアウト
                </Link>
            ) : (
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm text-gray-500 underline"
                    >
                        ログイン
                    </Link>
                    <Link
                        href="/register"
                        className="text-sm text-gray-500 underline"
                    >
                        新規登録
                    </Link>
                </div>
            )}
        </div>
    );
}
