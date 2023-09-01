import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const postsAdapter = createEntityAdapter({});

const initialState = postsAdapter.getInitialState();

export const postApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPost: builder.mutation({
            query: (postData) => ({
                url: "/post/create",
                method: "POST",
                body: postData,
            }),
            transformResponse: (responseData) => {
                const transformedData = {
                    id: responseData.id,
                    ...responseData,
                };
                return transformedData;
            },
            invalidatesTags: [{ type: "Post", id: "LIST" }],
        }),
        getPost: builder.query({
            query: (postId) => `/posts/${postId}`,
        }),
        getAllPosts: builder.query({
            query: () => "/post/all",
            transformResponse: (responseData) => {
                return responseData;
            },
        }),
        updatePost: builder.mutation({
            query: ({ postId, postData }) => ({
                url: `/post/${postId}`,
                method: "PUT",
                body: postData,
            }),
            transformResponse: (responseData) => {
                const transformedData = {
                    id: responseData.id,
                    ...responseData,
                };
                return transformedData;
            },
            invalidatesTags: (result, error, { postId }) => [{ type: "Post", id: postId }],
        }),
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `/post/${postId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { postId }) => [{ type: "Post", id: postId }],
        }),
        toggleLike: builder.mutation({
            query: (postId) => ({
                url: `/post/${postId}/toggle-like`,
                method: "POST",
            }),
            transformResponse: (responseData) => {
                const transformedData = {
                    id: responseData.id,
                    ...responseData,
                };
                return transformedData;
            },
            invalidatesTags: (result, error, { postId }) => [{ type: "Post", id: postId }],
        }),
        createComment: builder.mutation({
            query: ({ postId, commentData }) => ({
                url: `/post/${postId}/comments`,
                method: "POST",
                body: commentData,
            }),
            transformResponse: (responseData) => {
                const transformedData = {
                    id: responseData.id,
                    ...responseData,
                };
                return transformedData;
            },
            invalidatesTags: (result, error, { postId }) => [{ type: "Post", id: postId }],
        }),
        deleteComment: builder.mutation({
            query: ({ postId, commentId }) => ({
                url: `/post/${postId}/comments/${commentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { postId }) => [{ type: "Post", id: postId }],
        }),
    }),
});

export const {
    useCreatePostMutation,
    useGetPostQuery,
    useGetAllPostsQuery,
    useUpdatePostMutation,
    useDeletePostMutation,
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useToggleLikeMutation,
} = postApiSlice;

// Selectors
export const selectPostsResult = postApiSlice.endpoints.getAllPosts.select();

const selectPostsData = createSelector(
    selectPostsResult,
    (postsResult) => postsResult?.data
);

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
} = postsAdapter.getSelectors((state) => selectPostsData(state) ?? initialState);

// Additional selector to get the updated post after the toggle-like mutation
export const selectUpdatedPost = createSelector(
    selectPostById,
    postApiSlice.endpoints.toggleLike.select,
    (post, toggleLikeResult) => {
        if (toggleLikeResult?.data) {
            return {
                ...post,
                likes: toggleLikeResult.data.likes, // Updated likes array
            };
        }
        return post;
    }
);
