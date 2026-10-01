import { commentStatus, postStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";

const postcreate = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const allGetPost = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const tags = query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray = Array.isArray(tags) ? tags : [];


  const andConditions: PostWhereInput[] = [];

  if (query.searchTrem) {
    andConditions.push({
      OR: [
        { title: { contains: query.searchTrem, mode: "insensitive" } },
        {
          content: { contains: query.searchTrem, mode: "insensitive" },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({ title: query.title });
  }
  if (query.content) {
    andConditions.push({ content: query.content });
  }
  if (query.authorId) {
    andConditions.push({ authorId: query.authorId });
  }

  if (query.isFeatured) {
    andConditions.push({ isFeatured: Boolean(query.isFeatured) });
  }

  if (query.tags) {
    andConditions.push({ tags: { hasSome: tagsArray } });
  }
  if (query.status) {
    andConditions.push({ status: query.status });
  }

  const result = await prisma.post.findMany({
    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "developer",
    //       },
    //       content: "rolandoa",
    //     },
    //     {
    //       comment: {
    //         some: {
    //           content: {
    //             contains: "rolando",
    //           },
    //         },
    //       },
    //     },
    //   ],
    // },

    // Searchcing value

    // where: {
    //   title: {
    //     contains: "developer",
    //     mode: "insensitive",
    //   },
    //   content: {
    //     contains: "developer",
    //   },
    // },

    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "developer",
    //         mode: "insensitive",
    //       },
    //     },
    //     {
    //       content: {
    //         contains: "a",
    //         mode: "insensitive",
    //       },
    //     },
    //   ],
    // },

    // where: {
    //   AND: [
    //     {
    //       OR: [
    //         {
    //           title: {
    //             contains: "developer",
    //             mode: "insensitive",
    //           },
    //           content: {
    //             contains: "developer",
    //             mode: "insensitive",
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       title: "developer",
    //     },
    //     {
    //       content: "developer",
    //     },
    //   ],
    // },
    // take: 1,
    // skip: 1,
    // where: {
    //   AND: [
    //     query.searchTrem
    //       ? {
    //           OR: [
    //             { title: { contains: query.searchTrem, mode: "insensitive" } },
    //             {
    //               content: { contains: query.searchTrem, mode: "insensitive" },
    //             },
    //           ],
    //         }
    //       : {},

    //     query.title ? { title: query.title } : {},
    //     query.content ? { content: query.content } : {},
    //   ],
    // },

    where: {
      AND: andConditions,
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },

      comment: true,
    },
  });

  return result;
};

const statsPost = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // {
    //   // const totalPost = await tx.post.count();
    // // const totalPublishPost = await tx.post.count({
    // //   where: {
    // //     status: postStatus.PUBLISHED,
    // //   },
    // // });
    // // const totalDraftPost = await tx.post.count({
    // //   where: {
    // //     status: postStatus.DRAFT,
    // //   },
    // // });
    // // const totalArchivedPost = await tx.post.count({
    // //   where: {
    // //     status: postStatus.ARCHIVED,
    // //   },
    // // });

    // // const totalComment = await tx.comment.count();
    // // const totalApprovedComment = await tx.comment.count({
    // //   where: {
    // //     status: commentStatus.APPROVED,
    // //   },
    // // });
    // // const totalRejectComment = await tx.comment.count({
    // //   where: {
    // //     status: commentStatus.REJECT,
    // //   },
    // // });

    // // const allPosts = await tx.post.findMany();
    // // let totalPostCount = 0;

    // // allPosts.forEach((post) => {
    // //   totalPostCount = totalPostCount + post.views;
    // // });

    // // const totalPostViewsAggregate = await tx.post.aggregate({
    // //   _sum: {
    // //     views: true,
    // //   },
    // // });
    // // const totalPostViews = totalPostViewsAggregate._sum.views;

    // }
    const [
      totalPost,
      totalPublishPost,
      totalDraftPost,
      totalArchivedPost,
      totalComment,
      totalApprovedComment,
      totalRejectComment,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: postStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: postStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: postStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: commentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: commentStatus.REJECT,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPost,
      totalPublishPost,
      totalDraftPost,
      totalArchivedPost,
      totalComment,
      totalApprovedComment,
      totalRejectComment,
      totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });

  return transactionResult;
};

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
  // await prisma.post.update({
  //   where: { id: postId },
  //   data: {
  //     views: { increment: 1 },
  //   },
  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: { id: postId },
  //   include: {
  //     author: {
  //       omit: { password: true },
  //     },
  //     comment: {
  //       where: {
  //         status: commentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comment: true,
  //       },
  //     },
  //   },
  // });

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
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
  });

  return transactionResult;
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

const getViewedPosts = async () => {
  const posts = await prisma.post.findMany({
    where: {
      views: {
        gte: 1,
      },
    },
    orderBy: {
      views: "desc",
    },
  });

  return posts;
};

export const postService = {
  postcreate,
  statsPost,
  getMyPosts,
  getPostById,
  allGetPost,
  updatePost,
  deletePost,
  getViewedPosts,
};
