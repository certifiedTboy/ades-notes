import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

export const authApis = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    loginWithGoogle: builder.mutation({
      query: (payload) => ({
        url: "/auth/login/google",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
    }),

    getNewToken: builder.mutation({
      query: () => ({
        url: `/auth/new-access-token`,
        method: "GET",
      }),
    }),

    requestPasswordReset: builder.mutation({
      query: (payload) => ({
        url: `/auth/password-reset`,
        method: "PATCH",
        body: payload,
      }),
    }),

    updatePassword: builder.mutation({
      query: (payload) => ({
        url: `/auth/update-password`,
        method: "PATCH",
        body: payload,
      }),
    }),

    loginWithGithub: builder.mutation({
      query: (payload) => ({
        url: `/auth/login/github?code=${payload.githubToken}`,
        method: "POST",
        credentials: "include",
        body: { acceptTerms: payload?.acceptTerms },
      }),
    }),

    logoutUserAccount: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRequestPasswordResetMutation,
  useGetNewTokenMutation,
  useUpdatePasswordMutation,
  useLoginWithGoogleMutation,
  useLoginWithGithubMutation,
  useLogoutUserAccountMutation,
} = authApis;
