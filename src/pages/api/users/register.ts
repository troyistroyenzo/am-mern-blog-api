import argon2 from "argon2";

import { connectToDatabase } from "@/lib/mongodb";
import User, { IRegisterUserDto, IUserJson } from "@/models/User";

export default async function handler(
  req: ApiRequest<IRegisterUserDto>,
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

    const passwordHash = await argon2.hash(password);

    const user = await User.create({ username, passwordHash });

    const data = { ...user };
    delete data["passwordHash"];

    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
