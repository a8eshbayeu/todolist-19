import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { PAGE_SIZE } from "@/common/constants"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { page: number } }>({
      query: ({ todolistId, params }) =>
        ({
          url: `todo-lists/${todolistId}/tasks`,
          params: { ...params, count: PAGE_SIZE }
        }),
      providesTags:
        (_result, _error, { todolistId }) =>
          [{ type: "Task", id: todolistId }]
    }),
    addTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title }
      }),
      invalidatesTags:
        (_result, _error, { todolistId }) => {
          return [{ type: "Task", id: todolistId }]
        }
    }),
    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE"
      }),
      invalidatesTags:
        (_result, _error, { todolistId }) =>
          [{ type: "Task", id: todolistId }]
    }),
    updateTask: build.mutation<BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model
      }),
      onQueryStarted: async ({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) => {
        const cachedArgs = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

        const patchResults: any[] = []

        cachedArgs.forEach((cachedArgs) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData("getTasks", {
                todolistId,
                params: { page: cachedArgs.params.page }
              }, (response) => {
                const index = response.items.findIndex(task => task.id === taskId)
                if (index !== -1) {
                  response.items[index] = { ...response.items[index], ...model }
                }
              })
            )
          )

        })
        try {
          await queryFulfilled
        } catch (e) {
          patchResults.forEach((patchResult) => {
            patchResult.undo()
          })
        }
      },
      invalidatesTags:
        (_result, _error, { todolistId }) =>
          [{ type: "Task", id: todolistId }]
    })
  })
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi


