import { baseApi } from "@/app/baseApi.ts"
import type { BaseResponse, LoginResponse } from "@/common/types"
import type { LoginInputs } from "@/features/auth/lib/schemas"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginInputs>({
      query: (body) => ({ method: "post", url: "auth/login", body }),
    }),
    logout: builder.mutation<BaseResponse, void>({
      query: () => ({ method: "delete", url: "auth/login" }),
    }),
    me: builder.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
      query: () => "auth/me",
    }),
    getCaptcha: builder.query<{ url: string }, void>({
      query: () => "security/get-captcha-url",
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useMeQuery, useLazyGetCaptchaQuery } = authApi
