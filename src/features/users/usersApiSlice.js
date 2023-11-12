import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // transformResponse: responseData => {
            //     const loadedUser = responseData.map(user => {
            //         user.id = user._id
            //         return user
            //     });
            //     return usersAdapter.setAll(initialState, loadedUser)
            // },
            providesTags: (result, error, id) => [{ type: 'User', id }]
        }),
        getUserData: builder.mutation({
            query: ({userID}) => ({
                url: '/users',
                method: 'POST',
                body: {
                    userID: userID
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        getUserPageData: builder.mutation({
            query: ({userID}) => ({
                url: '/users/page',
                method: 'POST',
                body: {
                    userID: userID
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        addNewUser: builder.mutation({
            query: ({user, pwd, country, about, image, tempId}) => ({
                url: '/auth/register',
                method: 'POST',
                body: {
                    user: user,
                    pwd: pwd,
                    country: country,
                    about: about,
                    image: image,
                    tempId: tempId
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        updateUser: builder.mutation({
            query: ({userID, pwd, country, about, image, active}) => ({
                url: '/users',
                method: 'PUT',
                body: {
                    userID: userID,
                    image: image,
                    country: country,
                    about: about,
                    pwd: pwd,
                    active: active
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        removeUserRecipe: builder.mutation({
            query: ({userID, recipeID}) => ({
                url: '/users/recipe',
                method: 'DELETE',
                body: {
                    userID: userID,
                    recipeID: recipeID
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        addUserRecipe: builder.mutation({
            query: ({userID, recipeID}) => ({
                url: '/users/recipe',
                method: 'POST',
                body: {
                    userID: userID,
                    recipeID: recipeID
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        updateFavorite: builder.mutation({
            query: ({recipeID, stat, userID}) => ({
                url: '/users/favorite',
                method: 'PUT',
                body: {
                    recipeID: recipeID,
                    stat: stat,
                    userID: userID
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        getCommentedBy: builder.mutation({
            query: ({users}) => ({
                url: '/users/commentedBy',
                method: 'POST',
                body: {
                    users: users
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        getUserWhoPosted: builder.mutation({
            query: ({userID}) => ({
                url: '/users/poster',
                method: 'POST',
                body: {
                    userID: userID
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        createCollection: builder.mutation({
            query: ({userID, name, image}) => ({
                url: '/users/collection',
                method: 'POST',
                body: {
                    userID: userID,
                    name: name,
                    image: image
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        addCollection: builder.mutation({
            query: ({userID, recipeID, collectionIndex}) => ({
                url: '/users/collection',
                method: 'PUT',
                body: {
                    userID: userID,
                    recipeID: recipeID,
                    collectionIndex: collectionIndex
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
            ]
        }),
        getCollections: builder.mutation({
            query: ({ userID }) => ({
                url: `/users/collections`,
                method: 'PUT',
                body: {
                    userID: userID
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Recipe', id: arg.id }
            ]
        }),
        removeFromCollection: builder.mutation({
            query: ({ recipes, userID, collectionIndex }) => ({
                url: `/users/collections`,
                method: 'DELETE',
                body: {
                    recipes: recipes,
                    userID: userID,
                    collectionIndex: collectionIndex
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Recipe', id: arg.id }
            ]
        }),
        deleteCollection: builder.mutation({
            query: ({ userID, collectionIndex }) => ({
                url: `/users/collection`,
                method: 'DELETE',
                body: {
                    userID: userID,
                    collectionIndex: collectionIndex
                }
            }),
            // invalidatesTags: (result, error, arg) => [
            //     { type: 'Recipe', id: arg.id }
            // ]
        }),
        updateCollection: builder.mutation({
            query: ({ userID, collectionIndex, name, image }) => ({
                url: `/users/collections`,
                method: 'PATCH',
                body: {
                    userID: userID,
                    collectionIndex: collectionIndex,
                    name: name,
                    image: image
                }
            }),
            // invalidatesTags: (result, error, arg) => [
            //     { type: 'Recipe', id: arg.id }
            // ]
        })
    })
})

export const {
    useGetUserQuery,
    useGetUserDataMutation,
    useGetUserPageDataMutation,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useRemoveUserRecipeMutation,
    useAddUserRecipeMutation,
    useUpdateFavoriteMutation,
    useGetCommentedByMutation,
    useGetUserWhoPostedMutation,
    useCreateCollectionMutation,
    useAddCollectionMutation,
    useGetCollectionsMutation,
    useRemoveFromCollectionMutation,
    useDeleteCollectionMutation,
    useUpdateCollectionMutation
} = usersApiSlice

export const selectUserResult = usersApiSlice.endpoints.getUser.select()

const selectUserData = createSelector(
    selectUserResult,
    userResult => userResult.data
)

export const {
    selectById: selectUserById
} = usersAdapter.getSelectors(state => selectUserData(state) ?? initialState)