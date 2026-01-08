export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T = {}> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
}

export type LoginResponse = BaseResponse<{
  userId: number
  token: string
}> & {
  captchaUrl?: string
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
