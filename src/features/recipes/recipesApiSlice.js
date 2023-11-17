//import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const recipesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.createdOn === b.createdOn) ? 0 : a.createdOn ? 1 : -1
})

const initialState = recipesAdapter.getInitialState()

export const recipesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRecipes: builder.query({
            query: () => ({
                url: '/recipes',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedRecipes = responseData.map(recipe => {
                    recipe.id = recipe._id
                    return recipe
                });
                return recipesAdapter.setAll(initialState, loadedRecipes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Recipe', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Recipe', id }))
                    ]
                } else return [{ type: 'Recipe', id: 'LIST' }]
            }
        }),
        getRecipesByName: builder.mutation({
            query: ({name, slice, lng}) => ({
                url: `/recipes/name`,
                method: 'POST',
                body: {
                    name: name,
                    slice: slice,
                    lng: lng
                }
            })
        }),
        getRecipesByCategory: builder.mutation({
            query: ({category, slice, lng}) => ({
                url: `/recipes/category`,
                method: 'POST',
                body: {
                    category: category, 
                    slice: slice,
                    lng: lng
                }
            })
        }),
        getRecipesByIngredients: builder.mutation({
            query: ({ingredients, slice, lng}) => ({
                url: `/recipes/ingredients`,
                method: 'POST',
                body: {
                    ingredients: ingredients,
                    slice: slice,
                    lng: lng
                }
            })
        }),
        getBestRecipes: builder.mutation({
            query: ({lng}) => ({
                url: `/recipes/best`,
                method: 'POST',
                body: {
                    lng: lng
                }
            }),
        }),
        getNewestRecipes: builder.mutation({
            query: ({lng}) => ({
                url: `/recipes/newest`,
                method: 'POST',
                body: {
                    lng: lng
                }
            }),
        }),
        getRecipesData: builder.mutation({
            query: ({recipes}) => ({
                url: `/recipes`,
                method: 'POST',
                body: {
                    recipes: recipes
                }
            }),
        }),
        getCollectionRecipesData: builder.mutation({
            query: ({recipes}) => ({
                url: `/recipes/collections`,
                method: 'POST',
                body: {
                    recipes: recipes
                }
            }),
        }),
        getUserRecipes: builder.mutation({
            query: ({userID}) => ({
                url: `/recipes/user`,
                method: 'POST',
                body: { 
                    userID: userID
                }
            }),
        }),
        getRecipe: builder.mutation({
            query: ({id, commentsSlice}) => ({
                url: `/recipes/recipe`,
                method: 'POST',
                body: { 
                    id: id,
                    commentsSlice: commentsSlice
                }
            }),
        }),
        getMyRecipes: builder.mutation({
            query: user => ({
                url: '/myrecipes',
                method: 'POST',
                body: {
                    name: user
                }
            }),
            // invalidatesTags: [
            //     { type: 'Recipe', id: "LIST" }
            // ]
        }),
        getMyFavoriteRecipes: builder.mutation({
            query: ({userID}) => ({
                url: '/recipes/favorites',
                method: 'POST',
                body: {
                    userID: userID
                }
            })
        }),
        getMyRecipesByName: builder.mutation({
            query: name => ({
                url: '/myrecipes/name',
                method: 'POST',
                body: {
                    name: name
                }
            }),
            // invalidatesTags: [
            //     { type: 'Recipe', id: "LIST" }
            // ]
        }),
        getMyRecipesByIngredients: builder.mutation({
            query: ingredients => ({
                url: '/myrecipes/ingredients',
                method: 'POST',
                body: {
                    name: ingredients
                }
            }),
            // invalidatesTags: [
            //     { type: 'Recipe', id: "LIST" }
            // ]
        }),
        getMyRecipesByCategory: builder.mutation({
            query: category => ({
                url: '/myrecipes/category',
                method: 'POST',
                body: {
                    name: category
                }
            }),
        }),
        addNewRecipe: builder.mutation({
            query: initialRecipe => ({
                url: '/recipes/new',
                method: 'POST',
                body: {
                    ...initialRecipe,
                }
            }),
        }),
        updateRecipe: builder.mutation({
            query: ({id, stat, userID}) => ({
                url: '/recipes',
                method: 'PUT',
                body: {
                    id: id,
                    stat: stat,
                    userID: userID
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Recipe', id: "LIST" }
            ]
        }),
        updateRecipeData: builder.mutation({
            query: ({id, name, category, ingredients, preparation, cookingTime, servings, pictures}) => ({
                url: '/recipes/update',
                method: 'PUT',
                body: {
                    id: id,
                    name: name, 
                    category: category, 
                    ingredients: ingredients, 
                    preparation: preparation, 
                    cookingTime: cookingTime, 
                    servings: servings,
                    pictures: pictures
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Recipe', id: "LIST" }
            ]
        }),
        likeComment: builder.mutation({
            query: ({recipeID, commentID, userID}) => ({
                url: '/recipes/comment',
                method: 'PUT',
                body: {
                    recipeID: recipeID,
                    commentID: commentID,
                    userID: userID
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Recipe', id: "LIST" }
            ]
        }),
        deleteComment: builder.mutation({
            query: ({recipeID, commentID, userID}) => ({
                url: '/recipes/comment',
                method: 'DELETE',
                body: {
                    recipeID: recipeID,
                    commentID: commentID,
                    userID: userID
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Recipe', id: "LIST" }
            ]
        }),
        deleteRecipe: builder.mutation({
            query: ({ id, userID }) => ({
                url: `/myrecipes`,
                method: 'DELETE',
                body: { 
                    id: id,
                    userID: userID
                }
            }),
        }),
        getComments: builder.mutation({
            query: ({ recipeID, commentsSlice }) => ({
                url: `/recipes/comments`,
                method: 'POST',
                body: {
                    recipeID: recipeID,
                    commentsSlice: commentsSlice
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Recipe', id: arg.id }
            ]
        })
    })
})

export const {
    useGetRecipesQuery,
    useGetBestRecipesMutation,
    useGetNewestRecipesMutation,
    useGetRecipesDataMutation,
    useGetCollectionRecipesDataMutation,
    useGetRecipeMutation,
    useGetUserRecipesMutation,
    useGetRecipesByNameMutation,
    useGetRecipesByIngredientsMutation,
    useGetRecipesByCategoryMutation,
    useGetMyFavoriteRecipesMutation,
    useGetMyRecipesMutation,
    useGetMyRecipesByNameMutation,
    useGetMyRecipesByIngredientsMutation,
    useGetMyRecipesByCategoryMutation,
    useAddNewRecipeMutation,
    useUpdateRecipeMutation,
    useUpdateRecipeDataMutation,
    useLikeCommentMutation,
    useDeleteCommentMutation,
    useDeleteRecipeMutation,
    useGetCommentsMutation
} = recipesApiSlice

// export const selectRecipesResult = recipesApiSlice.endpoints.getRecipes.select()

// const selectRecipesData = createSelector(
//     selectRecipesResult,
//     recipesResult => recipesResult.data
// )

// export const {
//     selectAll: selectAllRecipes,
//     selectById: selectRecipeById,
//     selectIds: selectRecipeIds
// } = recipesAdapter.getSelectors(state => selectRecipesData(state) ?? initialState)