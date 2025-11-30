import { fromThrowable } from "neverthrow"

import type { ParseJSONOptions } from "./formats/json"
import { defaultParseJSONOptions, parseJSON } from "./formats/json"
import { objectKeys } from "./typeHelpers"
import { EnhancedError, extractFormatSuffix } from "./utils"

export class ParseError extends EnhancedError {}

export type ParseOptions = {
    json: ParseJSONOptions
    format?: string
}

export const defaultParseOptions = {
    json: defaultParseJSONOptions,
} as const satisfies ParseOptions

export const parseIt = fromThrowable(
    (stringifiedContent: string, parseOptions: ParseOptions) => {
        const { format, ...otherOptions } = parseOptions
        const fallbackFormat = objectKeys(otherOptions).sort().at(0) ?? ""
        const suffix = extractFormatSuffix(format ?? fallbackFormat)
        if (suffix === "json") {
            return parseJSON(stringifiedContent, otherOptions.json)
        }
        return stringifiedContent
    },
    (e) => new ParseError("Could not parse content", { cause: e }),
)
