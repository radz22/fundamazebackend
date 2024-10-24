import jwt from "jsonwebtoken";
import "dotenv/config";

const secretKey: string | any = process.env.JWTKEY;

export const GenerateToken = (
  payload: object,
  expiresIn: string | number = "1h"
) => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const VerifyToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey) as { id: string };
  } catch (err) {
    throw new Error("");
  }
};
