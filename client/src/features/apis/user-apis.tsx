import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

export const userApis = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    // prepareHeaders: async (headers) => {
    //   const token = localStorage.getItem("token");

    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //     headers.set("x-client-type", "web");
    //   }
    //   return headers;
    // },
  }),

  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: payload,
      }),
    }),

    verifyUserAccount: builder.mutation({
      query: (payload) => ({
        url: "/users/verify",
        method: "PATCH",
        body: payload,
      }),
    }),

    getUserProfile: builder.mutation({
      query: () => ({
        url: "/users/profile",
        method: "GET",
        credentials: "include",
      }),
    }),

    getAllUsers: builder.mutation({
      query: () => ({
        url: "/users",
        method: "GET",
        credentials: "include",
      }),
    }),

    addEmailToNewsLetter: builder.mutation({
      query: (payload) => ({
        url: "/users/news-letters",
        method: "POST",
        body: payload,
      }),
    }),

    removeEmailFromNewsLetters: builder.mutation({
      query: (payload) => ({
        url: "/users/news-letters",
        method: "DELETE",
        body: payload,
      }),
    }),

    getAllEmailsInNewsLetters: builder.mutation({
      query: (payload) => ({
        url: `/users/news-letters?page=${payload.page}&limit=${payload.limit}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteUserAccount: builder.mutation({
      query: () => ({
        url: "/users/delete",
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useVerifyUserAccountMutation,
  useGetUserProfileMutation,
  useGetAllUsersMutation,
  useAddEmailToNewsLetterMutation,
  useRemoveEmailFromNewsLettersMutation,
  useGetAllEmailsInNewsLettersMutation,
  useDeleteUserAccountMutation,
} = userApis;
