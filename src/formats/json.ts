import type { ParseError, ParseOptions } from "jsonc-parser"
import { parse } from "jsonc-parser"

export type ParseJSONOptions = Partial<ParseOptions>

export const defaultJSONParseOptions = {
    allowEmptyContent: true,
    allowTrailingComma: true,
    disallowComments: true,
} as const satisfies ParseJSONOptions

export function parseJSON(
    stringifiedContent: string,
    parseOptions: ParseJSONOptions = {},
) {
    const mergedOptions = { ...parseOptions, ...defaultJSONParseOptions }
    const errors: Array<ParseError> = []
    const unknownContent: unknown = parse(
        stringifiedContent,
        errors,
        mergedOptions,
    )
    if (errors.length > 0) {
        throw new SyntaxError("Could not parse JSON", { cause: errors })
    }
    return unknownContent
}
