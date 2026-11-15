import { GRADE3_WORDS } from './grade3';
import { GRADE4_WORDS } from './grade4';
import { GRADE5_WORDS } from './grade5';

// CUSTOMIZE: meaning(表示する日本語の意味)とword(タイピングする英単語のスペル)のペア。
// 英単語学習以外の用途(別言語・別テーマ)に使う場合もこの2フィールドの意味を入れ替えるだけで動く
export type Word = { meaning: string; word: string };

// CUSTOMIZE: キーは英検の級("5"/"4"/"3")。別の区分(難易度ラベル等)にしたい場合はキーを変える
export type Grade = '5' | '4' | '3';

export const WORDS_BY_GRADE: Record<Grade, Word[]> = {
    '5': GRADE5_WORDS,
    '4': GRADE4_WORDS,
    '3': GRADE3_WORDS,
};

export function isValidGrade(value: string): value is Grade {
    return value in WORDS_BY_GRADE;
}
