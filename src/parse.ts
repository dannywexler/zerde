import { fromThrowable } from "neverthrow"

import type { ParseJSONOptions } from "./formats/json"
import { defaultParseJSONOptions, parseJSON } from "./formats/json"
import type { ParseYAMLOptions } from "./formats/yaml"
import { parseYAML } from "./formats/yaml"
import { objectKeys } from "./typeHelpers"
import { EnhancedError, extractFormatSuffix } from "./utils"

export class ParseError extends EnhancedError {}

export type ParseOptions = Partial<{
    json: ParseJSONOptions
    yaml: ParseYAMLOptions
    format: string
}>

export const defaultParseOptions = {
    json: defaultParseJSONOptions,
    yaml: {},
} as const satisfies ParseOptions

export const parseIt = fromThrowable(
    (stringifiedContent: string, parseOptions: ParseOptions) => {
        const { format, ...otherOptions } = parseOptions
        const fallbackFormat = objectKeys(otherOptions).sort().at(0) ?? ""
        const suffix = extractFormatSuffix(format ?? fallbackFormat)
        if (suffix === "yaml" || suffix === "yml") {
            return parseYAML(stringifiedContent, otherOptions.yaml)
        }
        if (suffix === "json") {
            return parseJSON(stringifiedContent, otherOptions.json)
        }
        return stringifiedContent
    },
    (e) => new ParseError("Could not parse content", { cause: e }),
)
