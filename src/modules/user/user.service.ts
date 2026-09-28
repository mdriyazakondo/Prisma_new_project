import bcrypt from "bcryptjs";

import config from "../../config";
import { prisma } from "../../lib/prisma";

const userCreate = async (payload: {
  name: string;
  email: string;
  password: string;
  profilePhoto: string;
}) => {
  const { name, email, password, profilePhoto } = payload;

  // Check email already exists
  const emailExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailExist) {
    throw new Error("User with this email already exists");
  }

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
    },
  });

  // Create profile
  await prisma.profile.create({
    data: {
      userId: createUser.id,
      profilePhoto,
    },
  });

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

export const userService = {
  userCreate,
};
