import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ResultAsync } from "neverthrow"

import { EnhancedError } from "./utils"

export interface ValidationIssue extends StandardSchemaV1.Issue {
    input: unknown
}

export type ValidationIssues = ReadonlyArray<ValidationIssue>

export class ValidationError extends EnhancedError {
    readonly tag = "ValidationError"
    readonly originalValue: unknown
    readonly issues: ValidationIssues

    constructor(originalValue: unknown, issues: ValidationIssues) {
        super("Content was not valid", { cause: undefined })
        this.originalValue = originalValue
        this.issues = issues
        this.name = "ValidationError"
    }
}

export const validateIt = ResultAsync.fromThrowable(
    async <Schema extends StandardSchemaV1>(
        unknownContent: unknown,
        schema: Schema,
    ) => {
        const result = await schema["~standard"].validate(unknownContent)
        if (result.issues) {
            const mappedIssues = result.issues.map((originalIssue) => ({
                ...originalIssue,
                input: extractOriginalInput(unknownContent, originalIssue),
            }))
            throw new ValidationError(unknownContent, mappedIssues)
        }
        return result.value as StandardSchemaV1.InferOutput<Schema>
    },
    (e) => e as ValidationError,
)

function extractOriginalInput(
    originalValue: unknown,
    originalIssue: StandardSchemaV1.Issue,
) {
    let newValue = originalValue
    for (const pathEntry of originalIssue.path ?? []) {
        // @ts-expect-error exploring the unknown
        newValue = newValue[pathEntry]
    }
    return newValue
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    const cases = [
        ["simpleObject", ["hello"], { hello: "world" }, "world"],
        [
            "nestedObject",
            ["deeply", "nested", "object"],
            { deeply: { nested: { object: "someValue" } } },
            "someValue",
        ],
        ["array", [1], ["zero", "one"], "one"],
        ["noPath", undefined, { hello: "world" }, { hello: "world" }],
    ]

    describe("extractOriginalInput", () => {
        for (const [testcase, path, testItem, expectedValue] of cases) {
            const validationIssue = {
                message: "something went wrong",
                path,
            } as ValidationIssue
            it(`Can handle ${testcase}`, () => {
                expect(extractOriginalInput(testItem, validationIssue)).toEqual(
                    expectedValue,
                )
            })
        }
    })
}
