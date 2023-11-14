import { apiSlice } from "../../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        tempLogin: builder.mutation({
            query: ({userID}) => ({
                url: '/temp',
                method: 'POST',
                body: {
                    userID: userID
                }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    //console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    // setTimeout(() => {
                    //     dispatch(apiSlice.util.resetApiState())
                    // }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    //console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        verifyUsername: builder.mutation({
            query: ({ username, tempId }) => ({
                url: '/auth/verify',
                method: 'POST',
                body: {
                    username: username,
                    tempId: tempId
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Recipe', id: arg.id }
            ]
        })
    })
})

export const {
    useLoginMutation,
    useTempLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
    useVerifyUsernameMutation
} = authApiSlice 