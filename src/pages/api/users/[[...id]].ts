import { NextApiRequest, NextApiRequestWithBody, NextApiResponse } from "next";

import rateLimit from "@/middlewares/rateLimit";
import { connectToDatabase } from "@/lib/mongodb";
import methodNotAllowed from "@/middlewares/methodNotAllowed";
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

    // make sure password is hashed
    const passwordHash = await hashPassword(password);
    const user = await User.create({ username, passwordHash });

    const userDto = {
      username: user.username,
      _id: user._id,
      __v: user.__v,
    };

    // generate access token
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

    // check if the user has correct password against the db
    const isVerified = await verifyPassword(user.passwordHash, password);
    if (!isVerified) {
      throw new Error("Incorrect password");
    }

    const userDto = {
      username: user.username,
      _id: user._id,
      __v: user.__v,
    };

    // generate token
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
  // apply rate limit and method not allowed
  await rateLimit(req, res);
  await methodNotAllowed(req, res, { allowedMethods: ["POST"] })();

  // connect to db
  try {
    await connectToDatabase();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  const { id } = req.query;

  // if no id in the path, then simply do POST (create)
  if (!id) {
    await handlePost(req, res);
  } else {
    const path = typeof id === "string" ? id : id[0];
    // do login if login in the path
    switch (path) {
      case "login":
        await handleLogin(req, res);
        break;
    }
  }
};

export default handler;
