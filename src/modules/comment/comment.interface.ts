import { commentStatus } from "../../../generated/prisma/enums";

export interface ICreateCommentPayload {
  postId: string;
  authorId: string;
  content: string;
}

export interface IUpdateCommentPayload {
  content?: string;
  status?: commentStatus;
}

export interface IModerateCommentPayload {
  status: commentStatus;
}
