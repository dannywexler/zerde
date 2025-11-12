import { fromThrowable } from "neverthrow"

import type { StringifyJSONOptions } from "./formats/json"
import { defaultStringifyJSONOptions, stringifyJSON } from "./formats/json"
import { EnhancedError, extractFormatSuffix } from "./utils"

export class StringifyError extends EnhancedError {}

export type StringifyOptions = {
    json: StringifyJSONOptions
}

export const defaultStringifyOptions = {
    json: defaultStringifyJSONOptions,
} as const satisfies StringifyOptions

export const stringifyIt = fromThrowable(
    (
        unknownContent: unknown,
        formatAndStringifyOptions: Partial<
            StringifyOptions & { format: string }
        >,
    ) => {
        if (typeof unknownContent === "string") {
            return unknownContent
        }
        const { format, ...otherOptions } = formatAndStringifyOptions
        const suffix = extractFormatSuffix(format ?? "")
        if (suffix === "yaml" || suffix === "yml") {
            // placeholder for stringifyYAML
        }
        // default to JSON stringify if unknown suffix
        return stringifyJSON(unknownContent, otherOptions.json)
    },
    (e) => new StringifyError("Could not stringify content", { cause: e }),
)
