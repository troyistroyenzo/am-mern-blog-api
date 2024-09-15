import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { connectToDatabase } from "@/lib/mongodb";
import User, { ILoginUserDto, IUserJson } from "@/models/User";

export default async function handler(
  req: ApiRequest<ILoginUserDto>,
  res: ApiResponse<IUserJson>
) {
  const { method } = req;

  if (method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    await connectToDatabase();
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User does not exists");
    }

    const isVerified = await argon2.verify(user.passwordHash, password);
    if (!isVerified) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY as string
    );

    res.status(201).json({
      success: true,
      data: {
        username: user.username,
        token,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      let statusCode;
      if (err.message === "User does not exists") {
        statusCode = 404;
      } else if (err.message === "Invalid password") {
        statusCode = 401;
      } else {
        statusCode = 400;
      }
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
