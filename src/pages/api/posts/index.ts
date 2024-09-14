import queryString from "query-string";
import { RootFilterQuery } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import Post, { ICreatePostDto, IPostJson } from "@/models/Post";

const executor = {
  GET: (
    query: RootFilterQuery<{ title?: string; content?: string; _id?: string }>
  ) => Post.find(query),
  POST: (data: ICreatePostDto) => Post.create(data),
};

export default async function handler(
  req: ApiRequest<ICreatePostDto | undefined>,
  res: ApiResponse<IPostJson | IPostJson[]>
) {
  const { method, url, body } = req;

  try {
    await connectToDatabase();
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
  try {
    let result;
    let statusCode;
    switch (method) {
      case "GET":
        const { query } = queryString.parseUrl(url || "");
        result = await executor["GET"](query);
        statusCode = 200;
        break;
      case "POST":
        if (!body || !Object.keys(body).length) {
          throw new Error("Post json data is required");
        }
        result = await executor["POST"](body);
        statusCode = 201;
        break;
      default:
        throw new Error("Method not allowed");
    }

    res.status(statusCode).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error) {
      let statusCode;
      if (err.message === "Method not allowed") {
        statusCode = 405;
      } else {
        statusCode = 400;
      }
      res.status(statusCode).json({ success: false, error: err.message });
    }
  }
}
