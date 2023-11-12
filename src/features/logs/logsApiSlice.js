import { apiSlice } from "../../app/api/apiSlice"

export const logsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        logEntry: builder.mutation({
            query: ({activity, recipeID, userID}) => ({
                url: '/log',
                method: 'POST',
                body: {
                    activity: activity,
                    recipeID: recipeID,
                    userID: userID
                }
            })
        }),
        getLogs: builder.mutation({
            query: ({userID, logsSlice}) => ({
                url: '/log/get',
                method: 'POST',
                body: {
                    userID: userID,
                    logsSlice: logsSlice
                }
            })
        }),
        removeRecipeLogs: builder.mutation({
            query: ({recipeID}) => ({
                url: '/log',
                method: 'DELETE',
                body: {
                    recipeID: recipeID
                }
            })
        }),
        deleteLogEntry: builder.mutation({
            query: ({logID}) => ({
                url: '/log/entry',
                method: 'DELETE',
                body: {
                    logID: logID
                }
            })
        })
    })
})

export const {
    useLogEntryMutation,
    useGetLogsMutation,
    useRemoveRecipeLogsMutation,
    useDeleteLogEntryMutation,
} = logsApiSlice