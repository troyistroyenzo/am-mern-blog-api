import queryString from "query-string";

import { connectToDatabase } from "@/lib/mongodb";
import Post, { ICreatePostDto, IPostJson } from "@/models/Post";

export default async function handler(
  req: ApiRequest<ICreatePostDto | undefined>,
  res: ApiResponse<IPostJson | IPostJson[]>
) {
  const { method, url } = req;

  await connectToDatabase();

  switch (method) {
    case "GET":
      try {
        const { query } = queryString.parseUrl(url || "");
        const posts = await Post.find(query);
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, error: "Failed to fetch posts" });
      }
      break;
    case "POST":
      try {
        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        if (error instanceof Error && error.message.includes("validation")) {
          res.status(400).json({ success: false, error: error.message });
        } else {
          res
            .status(500)
            .json({ success: false, error: "Failed to create post" });
        }
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
