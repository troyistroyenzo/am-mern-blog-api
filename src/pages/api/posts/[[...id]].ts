import type {
  NextApiRequest,
  NextApiRequestWithBody,
  NextApiResponse,
} from "next";

import authGuard from "@/middlewares/authGuard";
import { connectToDatabase } from "@/lib/mongodb";
import Post, {
  ICreatePostDto,
  IPaginatedPostsDto,
  IPostDto,
  IUpdatePostDto,
} from "@/models/Post";

export type Data = {
  success: boolean;
  data?: IPostDto | IPaginatedPostsDto;
  error?: string;
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { limit, page } = req.query;
    const limitQuery = Number(limit || 10);
    const pageQuery = Number(page || 0);

    const posts = await Post.find(
      {},
      {},
      { limit: limitQuery, skip: pageQuery * limitQuery }
    );

    res.status(200).json({
      success: true,
      data: {
        items: posts,
        prevPage: pageQuery === 0 ? null : pageQuery - 1,
        nextPage: posts.length < limitQuery ? null : pageQuery + 1,
        currPage: pageQuery,
        count: posts.length,
      },
    });
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

const handlePost = async (
  req: NextApiRequestWithBody<ICreatePostDto>,
  res: NextApiResponse<Data>
) => {
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
  req: NextApiRequestWithBody<IUpdatePostDto>,
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

  await authGuard(req, res);

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
    const postId = typeof id === "string" ? id : id[0];

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
