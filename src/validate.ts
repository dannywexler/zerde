import type { StandardSchemaV1 } from "@standard-schema/spec"
import { ResultAsync } from "neverthrow"

import { EnhancedError } from "./utils"

export class ValidationError extends EnhancedError {
    readonly issues: ReadonlyArray<StandardSchemaV1.Issue>

    constructor(issues: ReadonlyArray<StandardSchemaV1.Issue>) {
        super("Content was not valid", { cause: issues })
        this.issues = issues
    }
}

export const validateIt = ResultAsync.fromThrowable(
    async <Schema extends StandardSchemaV1>(
        unknownContent: unknown,
        schema: Schema,
    ) => {
        const result = await schema["~standard"].validate(unknownContent)
        if (result.issues) {
            throw new ValidationError(result.issues)
        }
        return result.value
    },
    (e) => e as ValidationError,
)
