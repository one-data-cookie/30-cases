import { sha256 } from 'js-sha256';

export function hashAnswer(str) {
    return sha256(str.toLowerCase());
}
