import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const getAllPosts = catchAsync(async (req: Request, res: Response) => {});

const createPost = catchAsync(async (req: Request, res: Response) => {});

const getPostsStats = catchAsync(async (req: Request, res: Response) => {});

const getMyPosts = catchAsync(async (req: Request, res: Response) => {});

const getPostById = catchAsync(async (req: Request, res: Response) => {});

const updatePost = catchAsync(async (req: Request, res: Response) => {});

const deletePost = catchAsync(async (req: Request, res: Response) => {});

export const postController = {
  createPost,
  getPostsStats,
  getMyPosts,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
};
