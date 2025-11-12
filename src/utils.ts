import { objectEntries } from "./typeHelpers"

export type ErrorInfo<T> = T & { cause: unknown }

export class EnhancedError<T = unknown> extends Error {
    constructor(message: string, info: ErrorInfo<T>) {
        super(message, { cause: info.cause })
        this.name = this.constructor.name
    }
}

const endSymbols = [".", "/", "\\", "+"]

export function extractFormatSuffix(format: string) {
    let suffix = format.trim()
    if (!suffix) {
        return suffix
    }
    const semiColonIndex = suffix.indexOf(";")
    if (semiColonIndex > 0) {
        suffix = suffix.slice(0, semiColonIndex)
    }

    const lastSymbolIndex = Math.max(
        ...endSymbols.map((symbol) => suffix.lastIndexOf(symbol)),
    )
    if (lastSymbolIndex < 0) {
        return suffix
    }
    return suffix.slice(lastSymbolIndex + 1)
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    const cases = {
        simple: "json",
        file: "file.json",
        "file with path": "some/path/to/file.json",
        "file with a windows path": "some\\path\\to\\file.json",
        "basic media type": "application/json",
        "complex media type": "application/customFormat+json",
        "media type with charset":
            "application/customFormat+json; charset=utf-8",
    }

    describe("extractFormatSuffix", () => {
        for (const [testcase, content] of objectEntries(cases)) {
            const message = `Can handle ${testcase}: ${content}`
            it(message, () => {
                expect(extractFormatSuffix(content)).toEqual("json")
            })
        }
    })
}
