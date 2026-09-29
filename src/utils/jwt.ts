import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

type TJwtPayload = JwtPayload & { id: string };

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifyToken = jwt.verify(token, secret);

    return {
      success: true,
      verifyToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = { createToken, verifyToken };
