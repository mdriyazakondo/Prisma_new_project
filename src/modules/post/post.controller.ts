import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const postData = req.body;
    const result = await postService.postcreate(postData, userId);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Post Create Successfylly",
      data: { result },
    });
  },
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await postService.allGetPost(query);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Posts Retreived Successfylly",
      data: { result },
    });
  },
);

const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId as string;

    if (!postId) {
      throw new Error("Post Id Required");
    }

    const result = await postService.getPostById(postId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Single Post Retreived Successfylly",
      data: { result },
    });
  },
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    const result = await postService.getMyPosts(authorId as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "My Posts retrieved successfuly",
      data: result,
    });
  },
);

const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.statsPost();
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Stats Post Retrieved successfuly",
      data: result,
    });
  },
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId as string;
    const payload = req.body;

    const result = await postService.updatePost(
      postId,
      payload,
      authorId,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Post Updated successfuly",
      data: result,
    });
  },
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    const postId = req.params.postId as string;

    await postService.deletePost(postId, authorId, isAdmin);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Post Updated successfuly",
    });
  },
);

const getViewedPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getViewedPosts();

    res.status(200).json({
      success: true,
      message: "Viewed posts retrieved successfully",
      data: result,
    });
  },
);

export const postController = {
  createPost,
  getPostsStats,
  getMyPosts,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
  getViewedPosts,
};
