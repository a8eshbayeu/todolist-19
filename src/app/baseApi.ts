import { AUTH_TOKEN } from "@/common/constants"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { handleError } from "@/common/utils/handleError.ts"

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],
  baseQuery: async (args, api, extraOptions) => {
    const BaseQuery = fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      credentials: 'include',
      headers: {
        "API-KEY": import.meta.env.VITE_API_KEY
      },
      prepareHeaders: (headers) => {
        const token = localStorage.getItem(AUTH_TOKEN)
        if (token) headers.set("Authorization", `Bearer ${token}`)
        return headers
      }
    })

    const result = await BaseQuery(args, api, extraOptions)

    handleError(api, result)

    return result
  },
  endpoints: () => ({})
})
