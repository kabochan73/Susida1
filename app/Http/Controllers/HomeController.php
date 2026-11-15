<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
            // TODO: Phase4でgame_sessionsテーブルができたら級ごとの集計クエリに差し替える
            'ranking' => [],
        ]);
    }
}
