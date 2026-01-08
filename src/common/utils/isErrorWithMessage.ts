/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
  */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object'
    && error !== null
    && 'message' in error
    && typeof error.message === 'string'
  }