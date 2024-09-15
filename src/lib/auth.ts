import argon2 from "argon2";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;
if (!SECRET_KEY) {
  throw new Error("A `SECRET_KEY` is required as environment variable");
}

export function generateToken<T extends object>(data: T) {
  return jwt.sign(data, SECRET_KEY, { expiresIn: "30d" });
}

export function verifyToken(token: string) {
  const decoded = jwt.verify(token, SECRET_KEY);
  return decoded;
}

export async function hashPassword(password: string) {
  return await argon2.hash(password);
}

export async function verifyPassword(passwordHash: string, password: string) {
  return await argon2.verify(passwordHash, password);
}
