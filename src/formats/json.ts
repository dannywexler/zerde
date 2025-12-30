import type { ParseError, ParseOptions } from "jsonc-parser"
import { parse } from "jsonc-parser"
import { configure } from "safe-stable-stringify"

// -------------- PARSE --------------

export type ParseJSONOptions = Partial<ParseOptions>

export const defaultParseJSONOptions = {
    allowEmptyContent: false,
    allowTrailingComma: false,
    disallowComments: true,
} satisfies ParseJSONOptions

export function parseJSON(
    stringifiedContent: string,
    parseOptions: ParseJSONOptions = {},
): unknown {
    const mergedOptions = { ...parseOptions, ...defaultParseJSONOptions }
    const errors: Array<ParseError> = []
    const unknownContent = parse(stringifiedContent, errors, mergedOptions)
    if (errors.length > 0) {
        throw new SyntaxError("Could not parse JSON", { cause: errors })
    }
    return unknownContent
}

// -------------- STRINGIFY --------------

export type StringifyJSONOptions = string | number

export const defaultStringifyJSONOptions =
    0 as const satisfies StringifyJSONOptions

const configuredStringify = configure({
    bigint: false,
    circularValue: TypeError,
    deterministic: true,
    strict: true,
})

export function stringifyJSON(
    unknownContent: unknown,
    stringifyOptions?: StringifyJSONOptions,
) {
    const res = configuredStringify(unknownContent, null, stringifyOptions)
    if (res === undefined) {
        throw new SyntaxError(
            "safe-stable-stringify should have thrown an error if trying to stringify an invalid json object",
        )
    }
    return res
}
