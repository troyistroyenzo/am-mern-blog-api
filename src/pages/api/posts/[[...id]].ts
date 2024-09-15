import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";

type Data = {
  success: boolean;
  data?: IPost | IPost[];
  error?: string;
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

const handleGetById = async (
  id: string,
  _: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const post = await Post.findById(id);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

const handlePut = async (
  id: string,
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

const handleDelete = async (
  id: string,
  _: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const post = await Post.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { method, query } = req;

  try {
    await connectToDatabase();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!method || !allowedMethods.includes(method)) {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { id } = query;

  if (!id) {
    switch (method) {
      case "GET":
        await handleGet(req, res);
        break;
      default:
        await handlePost(req, res);
        break;
    }
  } else {
    const postId = id[0];

    switch (method) {
      case "GET":
        await handleGetById(postId, req, res);
        break;
      case "PUT":
        await handlePut(postId, req, res);
        break;
      default:
        await handleDelete(postId, req, res);
        break;
    }
  }
};

export default handler;
