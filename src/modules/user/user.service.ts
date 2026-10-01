import bcrypt from "bcryptjs";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { RegisterInterface } from "./user.interface";

const userCreate = async (payload: RegisterInterface) => {
  const { name, email, password, profilePhoto } = payload;

  // Check email already exists
  const emailExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // if (emailExist) {
  //   throw new Error("User with this email already exists");
  // }

  // Hash password
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Create user
  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  // Create profile
  // await prisma.profile.create({
  //   data: {
  //     userId: createUser.id,
  //     profilePhoto,
  //   },
  // });

  // Get user with profile
  const user = await prisma.user.findUnique({
    where: {
      id: createUser.id,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const userAllFind = async () => {
  const user = await prisma.user.findMany();
  return user;
};

const getMyProfileDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const updateMyProfileDB = async (userID: string, payload: any) => {
  const { name, email, profilePhoto, bio } = payload;
  const result = await prisma.user.update({
    where: { id: userID },
    data: {
      name,
      email,

      profile: {
        update: {
          profilePhoto,
          bio,
        },
      },
    },
    omit: { password: true },
    include: { profile: true },
  });

  return result;
};

export const userService = {
  userCreate,
  userAllFind,
  getMyProfileDB,
  updateMyProfileDB,
};
