const UNICODE_HANGUL_START = 0xAC00; // 유니코드 한글 시작
const UNICODE_CONSONANT_START = 0x11A8 - 1; // 유니코드 자음 시작
const UNICODE_VOWEL_START = 0x1161; // 유니코드 모음 시작

const first_list = [ "r", "R", "s", "e", "E", "f", "a", "q",
        "Q", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g" ]

const middle_list = [ "k", "o", "i", "O", "j", "p", "u", "P",
    "h", "hk", "ho", "hl", "y", "n", "nj", "np", "nl", "b", "m",
    "ml", "l" ]

const final_list = [ " ", "r", "R", "rt", "s", "sw", "sg", "e",
    "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a",
    "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g" ]

type Type =
    "First" | // 초성
    "Middle" | // 중성
    "Final" | // 종성
    "Separate" | // 독립된 글자
    "Other" // 기타 문자

type Vector = Array<Type>

function isConsonantOrVowel(c: string) {
    switch (c) {
    case 'r': // ㄱ
    case 'R': // ㄲ
    case 's': // ㄴ
    case 'e': // ㄷ
    case 'E': // ㄸ
    case 'f': // ㄹ
    case 'a': // ㅁ
    case 'q': // ㅂ
    case 'Q': // ㅃ
    case 't': // ㅅ
    case 'T': // ㅆ
    case 'd': // ㅇ
    case 'w': // ㅈ
    case 'W': // ㅉ
    case 'c': // ㅊ
    case 'z': // ㅋ
    case 'x': // ㅌ
    case 'v': // ㅍ
    case 'g': // ㅎ
        return 1;
    case 'k': // ㅏ
    case 'o': // ㅐ
    case 'i': // ㅑ
    case 'O': // ㅒ
    case 'j': // ㅓ
    case 'p': // ㅔ
    case 'u': // ㅕ
    case 'P': // ㅖ
    case 'h': // ㅗ
    case 'y': // ㅛ
    case 'n': // ㅜ
    case 'b': // ㅠ
    case 'm': // ㅡ
    case 'l': // ㅣ
        return 2;
    default:
        return -1;
    }
}

function combineFinal(a: string, b: string): number {
    let s = a
    s += b

    let result = final_list.findIndex(element => element === s)
    return result === (final_list.length - 1) ? -1 : result
}

// 중성 결합
function combineMiddle(a: string, b: string) {
    let s = a
    s += b

    let result = middle_list.findIndex(element => element === s);
    return result === (middle_list.length - 1) ? -1 : result
}

function divide(str: string): Vector {
    let v: Vector = [];

    for (let i = 0; i < str.length; i++) {
        if (isConsonantOrVowel(str[i]) === 1) { // 자음일때
            if (i < str.length - 1) { // 뒤에 다른 글자가 있을 때
                if (isConsonantOrVowel(str[i + 1]) === 2) { // 그 글자가 모음이라면
                    v.push('First'); // 초성으로 넣어줌
                    continue;
                }
                if (i > 1) { // 앞에 다른 두 글자가 있을 때
                    if (v[i - 2] === 'First' && v[i - 1] === 'Middle' // 앞 두 글자가 초성 - 중성이고
                        && isConsonantOrVowel(str[i + 1]) !== 2) { // 뒤 글자가 자음이거나 기타 문자라면
                        v.push('Final'); // 종성으로 넣어줌
                        continue;
                    }
                }
                if (i > 2) { // 앞에 다른 세 글자가 있을 때
                    if (v[i - 3] === 'First' && v[i - 2] === 'Middle' && v[i - 1] === 'Final' // 앞 세 글자가 초성 - 중성 - 종성이고
                        && isConsonantOrVowel(str[i + 1]) !== 2 // 뒤 글자가 자음이거나 기타 문자이고
                        && combineFinal(str[i - 1], str[i]) !== -1) { // 앞 종성과 현재 자음이 결합된다면
                        v.push('Final'); // 종성으로 넣어줌
                        continue;
                    }
                    if (v[i - 3] === 'First' && v[i - 2] === 'Middle' && v[i - 1] === 'Middle' // 앞 세 글자가 초성 - 중성 - 중성이고
                        && isConsonantOrVowel(str[i + 1]) !== 2) { // 뒤 글자가 자음이거나 기타 문자라면
                        v.push('Final'); // 종성으로 넣어줌
                        continue;
                    }
                }
                if (i > 3) { // 앞에 다른 네 글자가 있을 때
                    if (v[i - 4] === 'First' && v[i - 3] === 'Middle' && v[i - 2] === 'Middle' && v[i - 1] === 'Final' // 앞 네 글자가 초성 - 중성 - 중성 - 종성이고
                        && isConsonantOrVowel(str[i + 1]) !== 2 // 뒤 글자가 자음이거나 기타 문자이고
                        && combineFinal(str[i - 1], str[i]) !== -1) { // 앞 종성과 현재 자음이 결합된다면
                        v.push('Final'); // 종성으로 넣어줌
                        continue;
                    }
                }
            } else { // 뒤에 다른 글자가 없을 때
                if (i > 1) { // 앞에 다른 두 글자가 있을 때
                    if (v[i - 2] === 'First' && v[i - 1] === 'Middle') { // 앞 두 글자가 초성 - 중성이라면
                        v.push('Final'); // 종성으로 넣어줌
                        continue;
                    }
                }
                if (i > 2) { // 앞에 다른 세 글자가 있을 때
                    if (v[i - 3] === 'First' && v[i - 2] === 'Middle' && v[i - 1] === 'Final' // 앞 세 글자가 초성 - 중성 - 종성이고
                        && combineFinal(str[i - 1], str[i]) !== -1) { // 앞 종성과 현재 자음이 결합된다면
                        v.push('Final'); // 종성으로 넣어줌
                        continue;
                    }
                    if (v[i - 3] === 'First' && v[i - 2] === 'Middle' && v[i - 1] === 'Middle') { // 앞 세 글자가 초성 - 중성 - 중성이라면
                        v.push('Final'); // 종성으로 넣어줌
                        continue;
                    }
                }
                if (i > 3) { // 앞에 다른 네 글자가 있을 때
                    if (v[i - 4] === 'First' && v[i - 3] === 'Middle' && v[i - 2] === 'Middle' && v[i - 1] === 'Final' // 앞 네 글자가 초성 - 중성 - 중성 - 종성이고
                        && combineFinal(str[i - 1], str[i]) !== -1) { // 앞 종성과 현재 자음이 결합된다면
                        v.push('Final'); // 종성으로 넣어줌
                        continue;
                    }
                }
            }

            v.push('Separate'); // 위 조건에 모두 해당되지 않는다면 독립된 글자로 넣어줌
            continue;
        } else if (isConsonantOrVowel(str[i]) === 2) { // 모음일때
            if (i !== 0) { // 앞에 다른 글자가 있을 때
                if (v[v.length - 1] === 'First') { // 그 글자가 초성이라면
                    v.push('Middle'); // 중성으로 넣어줌
                    continue;
                }
                if (v[v.length - 1] === 'Middle' // 그 글자가 중성이고
                    && combineMiddle(str[i - 1], str[i]) !== -1) { // 현재 모음과 결합된다면
                    v.push('Middle'); // 중성으로 넣어줌
                    continue;
                }
            }

            v.push('Separate'); // 위 조건에 모두 해당되지 않는다면 독립된 글자로 넣어줌
            continue;
        } else if ((str.charCodeAt(i) >= 32 && str.charCodeAt(i) <= 64) || (str.charCodeAt(i) >= 91 && str.charCodeAt(i) <= 96) || (str.charCodeAt(i) >= 123 && str.charCodeAt(i) <= 126)) { // 기타 문자
            v.push('Other');
            continue;
        }
    }

    return v;
}

function combine(str: string, typelist: Vector): string {
    let result = '';
    let i = 0;

    while (i < str.length) {
        if (typelist[i] === 'Separate') {
            if (isConsonantOrVowel(str[i]) === 1) { // 자음이라면
                if (i < str.length - 1) { // 뒤에 글자가 더 있고
                    let combinedFinal = combineFinal(str[i], str[i + 1]);
                    if (isConsonantOrVowel(str[i + 1]) === 1 && combinedFinal !== -1) { // 그 글자가 자음이고 현재 글자와 결합 가능할 때
                        result += String.fromCharCode(UNICODE_CONSONANT_START + combinedFinal)
                        i++;
                        continue;
                    }
                }
                let idx = final_list.findIndex(element => element === str[i]);
                result += String.fromCharCode(UNICODE_CONSONANT_START + idx);
                i++;
                continue;
            }
            else if (isConsonantOrVowel(str[i]) === 2) { // 모음이라면
                let idx = middle_list.findIndex(element => element === str[i]);
                result += String.fromCharCode(UNICODE_VOWEL_START + idx);
                i++;
                continue;
            }
        }
        else if (typelist[i] === 'Other') {
            result += str[i];
            i++;
            continue;
        }

        // 초성 : 무조건 1개
        let firstIdx = 0;
        if (typelist[i] === 'First') {
            firstIdx = first_list.findIndex(element => element === str[i]);
            i++;
        }

        // 중성 : 1개 ~ 2개
        let middleIdx = 0;
        if (typelist[i] === 'Middle') {
            middleIdx = middle_list.findIndex(element => element === str[i]);
            i++;

            if (i < str.length) {
                if (typelist[i] === 'Middle') {
                    let combinedMiddle = combineMiddle(str[i - 1], str[i]);

                    if (combinedMiddle !== -1)
                        middleIdx = combinedMiddle;

                    i++;
                }
            }
        }

        // 종성 : 0개 ~ 2개
        let finalIdx = 0;
        
        if (i < str.length) {
            if (typelist[i] === 'Final') {
                finalIdx = final_list.findIndex(element => element === str[i]);
                i++;

                if (i < str.length) {
                    if (typelist[i] === 'Final') {
                        let combinedFinal = combineFinal(str[i - 1], str[i]);

                        if (combinedFinal !== -1)
                            finalIdx = combinedFinal;

                        i++;
                    }
                }
            }
        }

        // 결합
        result += String.fromCharCode(UNICODE_HANGUL_START + (firstIdx * 21 * 28) + (middleIdx * 28) + finalIdx);
    }

    return result;
}

export default function solve(text: string): string {
    let tl = divide(text)
    console.log(tl)
    return combine(text, tl)
}