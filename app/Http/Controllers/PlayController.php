<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class PlayController extends Controller
{
    /**
     * Display the game screen. grade/mode come from the top page's selection.
     *
     * Backend only validates that `grade` is a non-empty string and `mode` is
     * a known enum value - it does not know which grades actually exist
     * (that list lives entirely in resources/js/lib/words, see docs/02-decisions-log.md).
     * An invalid request redirects back to the top page.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $validator = Validator::make($request->query(), [
            'grade' => ['required', 'string'],
            'mode' => ['required', 'string', 'in:practice,challenge'],
        ]);

        if ($validator->fails()) {
            return redirect('/');
        }

        $validated = $validator->validated();

        return Inertia::render('Play', [
            'grade' => $validated['grade'],
            'mode' => $validated['mode'],
        ]);
    }
}
