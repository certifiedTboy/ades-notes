import { type ReactionType } from "../posts/posts-model.ts";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  picture?: string;
  role?: string;
  confirmPassword?: string | undefined;
}

export interface IEventData {
  id: string;
  delayInMinutes: number;
  firstName?: string;
  email?: string;
  otp?: string;
}
export interface IEventData {
  id: string;
  delayInMinutes: number;
  [key: string]: any;
}

export type EventTypes =
  | "new-user"
  | "user-verified"
  | "password-reset"
  | "password-changed"
  | "add-comment"
  | "delete-comment"
  | "react-to-post"
  | "delete-post"
  | "update-post"
  | "update-comment"
  | "update-post-view-count"
  | "delete-s3-file"
  | "create-post"
  | "news-letter";

export interface IJWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ICommentEvent extends IEventData {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string | null;
}

export interface IReactionEvent extends IEventData {
  postId: string;
  authorId: string;
  type: ReactionType;
}

export interface IUpdateCommentEvent extends IEventData {
  commentId: string;
  content: string;
}
