import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

export const postApis = createApi({
  reducerPath: "pstApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),

  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (payload) => ({
        url: "/posts",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    getAllPosts: builder.mutation({
      query: (_payload) => ({
        url: "/posts",
        method: "GET",
        credentials: "include",
      }),
    }),

    getPublishedPosts: builder.mutation({
      query: () => ({
        url: `/posts/published`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getPostDetails: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload}`,
        method: "GET",
      }),
    }),

    addCommentToPost: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload.postId}/comments`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    reactToPosts: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload.postId}/reactions`,
        method: "POST",
        body: { type: payload.type },
        credentials: "include",
      }),
    }),

    updatePost: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload.id}`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
    }),

    getCommentsByPost: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload.postId}/comments?page=${payload.page}&limit=10`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getReactionsToPost: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload}/reactions`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deletePost: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    updatePostViewCount: builder.mutation({
      query: (payload) => ({
        url: `/posts/${payload}/view-count`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
    }),

    getAllComments: builder.mutation({
      query: () => ({
        url: `/posts/comments/all?page=1&limit=50`,
        method: "GET",
        credentials: "include",
      }),
    }),

    updateComment: builder.mutation({
      query: (payload) => ({
        url: `/posts/comments/${payload.commentId}`,
        method: "PATCH",
        body: payload,
        credentials: "include",
      }),
    }),

    deleteComment: builder.mutation({
      query: (payload) => ({
        url: `/posts/comments/${payload?.commentId}?postId=${payload?.postId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    uploadFileToAWSs3: builder.mutation({
      query: (payload) => ({
        url: `/posts/files/upload`,
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetAllPostsMutation,
  useGetPostDetailsMutation,
  useAddCommentToPostMutation,
  useReactToPostsMutation,
  useGetPublishedPostsMutation,
  useUpdatePostMutation,
  useGetCommentsByPostMutation,
  useGetReactionsToPostMutation,
  useDeletePostMutation,
  useUpdatePostViewCountMutation,
  useGetAllCommentsMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useUploadFileToAWSs3Mutation,
} = postApis;
