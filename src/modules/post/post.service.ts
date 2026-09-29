import { commentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const postcreate = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const allGetPost = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: { omit: { password: true } },
      comment: true,
    },
  });
  return result;
};

const statsPost = async () => {};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: { createAt: "desc" },
    include: {
      comment: true,
      author: {
        omit: { password: true },
      },
      _count: {
        select: {
          comment: true,
        },
      },
    },
  });

  return result;
};

const getPostById = async (postId: string) => {
  await prisma.post.update({
    where: { id: postId },
    data: {
      views: { increment: 1 },
    },
  });

  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    include: {
      author: {
        omit: { password: true },
      },
      comment: {
        where: {
          status: commentStatus.APPROVED,
        },
        orderBy: {
          createAt: "desc",
        },
      },
      _count: {
        select: {
          comment: true,
        },
      },
    },
  });

  return post;
};

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not owner of post!");
  }

  const result = await prisma.post.update({
    where: { id: postId },
    data: payload,
  });
  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not owner of post!");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  postcreate,
  statsPost,
  getMyPosts,
  getPostById,
  allGetPost,
  updatePost,
  deletePost,
};
