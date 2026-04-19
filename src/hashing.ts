import { stringifyJSON } from "./formats/json"

declare const _HASH_: unique symbol

const BASE_16_RADIX = 16
const BASE_36_RADIX = 36

export type Base10Hash = number & { readonly [_HASH_]: 10 }
export type Base16Hash = string & { readonly [_HASH_]: 16 }
export type Base36Hash = string & { readonly [_HASH_]: 36 }

function fnv1a(unknownContent: unknown) {
    const str = stringifyJSON(unknownContent)
    const len = str.length
    let hash = 2_166_136_261

    for (let i = 0; i < len; i++) {
        hash ^= str.charCodeAt(i)
        hash +=
            (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
    }

    return hash >>> 0
}

export function hashBase10(unknownContent: unknown) {
    return fnv1a(unknownContent) as Base10Hash
}

export function hashBase16(unknownContent: unknown) {
    return fnv1a(unknownContent).toString(BASE_16_RADIX) as Base16Hash
}

export function hashBase36(unknownContent: unknown) {
    return fnv1a(unknownContent).toString(BASE_36_RADIX) as Base36Hash
}
