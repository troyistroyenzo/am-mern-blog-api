import { NextApiRequest, NextApiRequestWithBody, NextApiResponse } from "next";

import { connectToDatabase } from "@/lib/mongodb";
import { generateToken, hashPassword, verifyPassword } from "@/lib/auth";
import User, {
  ICreateUserDto,
  ILoginUserDto,
  IUserDto,
  IUserWithTokenDto,
} from "@/models/User";

export type Data = {
  success: boolean;
  data?: IUserWithTokenDto;
  error?: string;
};

const handlePost = async (
  req: NextApiRequestWithBody<ICreateUserDto>,
  res: NextApiResponse<Data>
) => {
  try {
    const { username, password, reEnterPassword } = req.body;
    if (password !== reEnterPassword) {
      throw new Error("Passwords do not match");
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ username, passwordHash });

    const userDto = {
      username: user.username,
      _id: user._id,
      __v: user.__v,
    };
    const token = generateToken<IUserDto>(userDto);

    res.status(201).json({
      success: true,
      data: { ...userDto, token },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

const handleLogin = async (
  req: NextApiRequestWithBody<ILoginUserDto>,
  res: NextApiResponse<Data>
) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User does not exists");
    }

    const isVerified = await verifyPassword(user.passwordHash, password);
    if (!isVerified) {
      throw new Error("Incorrect password");
    }

    const userDto = {
      username: user.username,
      _id: user._id,
      __v: user.__v,
    };
    const token = generateToken<IUserDto>(userDto);

    res.status(200).json({
      success: true,
      data: { ...userDto, token },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { method } = req;

  try {
    await connectToDatabase();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  const allowedMethods = ["POST"];
  if (!method || !allowedMethods.includes(method)) {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    await handlePost(req, res);
  } else {
    const path = typeof id === "string" ? id : id[0];

    switch (path) {
      case "login":
        await handleLogin(req, res);
        break;
    }
  }
};

export default handler;
