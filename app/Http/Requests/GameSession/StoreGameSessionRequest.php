<?php

namespace App\Http\Requests\GameSession;

use Illuminate\Foundation\Http\FormRequest;

class StoreGameSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // grade: 値の一覧はバックエンドでは検証しない。frontendのlib/words/が定義する
            // 級の文字列をそのまま送る(docs/02-decisions-log.md)。
            'grade' => ['required', 'string', 'max:20'],
            'score' => ['required', 'integer', 'min:0'],
        ];
    }
}
