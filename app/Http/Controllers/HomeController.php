<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the top page: grade/mode selection + ranking sidebar.
     */
    public function index(Request $request): Response
    {
        $grade = $request->query('grade', '5');

        return Inertia::render('Home', [
            'grade' => $grade,
            'ranking' => $this->ranking($grade),
        ]);
    }

    /**
     * Top 10 for the given grade, ties broken by whoever reached that
     * score first (see docs/backend/database-schema.md).
     *
     * @return array<int, array{rank: int, name: string, bestScore: int}>
     */
    private function ranking(string $grade): array
    {
        $rows = DB::select(<<<'SQL'
            SELECT user_id, best_score, achieved_at
            FROM (
                SELECT
                    user_id,
                    score AS best_score,
                    created_at AS achieved_at,
                    ROW_NUMBER() OVER (
                        PARTITION BY user_id
                        ORDER BY score DESC, created_at ASC
                    ) AS rn
                FROM game_sessions
                WHERE grade = ?
            ) ranked
            WHERE rn = 1
            ORDER BY best_score DESC, achieved_at ASC
            LIMIT 10
        SQL, [$grade]);

        $names = User::whereIn('id', array_column($rows, 'user_id'))
            ->pluck('name', 'id');

        return collect($rows)
            ->values()
            ->map(fn ($row, int $index) => [
                'rank' => $index + 1,
                'name' => $names[$row->user_id] ?? '',
                'bestScore' => (int) $row->best_score,
            ])
            ->all();
    }
}
