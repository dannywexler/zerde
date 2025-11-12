import { fromThrowable } from "neverthrow"

import type { ParseJSONOptions } from "./formats/json"
import { defaultParseJSONOptions, parseJSON } from "./formats/json"
import { EnhancedError, extractFormatSuffix } from "./utils"

export class ParseError extends EnhancedError {}

export type ParseOptions = {
    json: ParseJSONOptions
}

export const defaultParseOptions = {
    json: defaultParseJSONOptions,
} as const satisfies ParseOptions

export const parseIt = fromThrowable(
    (
        stringifiedContent: string,
        formatAndParseOptions: Partial<ParseOptions & { format: string }>,
    ) => {
        const { format, ...otherOptions } = formatAndParseOptions
        const suffix = extractFormatSuffix(format ?? "")
        if (suffix === "json") {
            return parseJSON(stringifiedContent, otherOptions.json)
        }
        return stringifiedContent
    },
    (e) => new ParseError("Could not parse content", { cause: e }),
)
