import { connectToDatabase } from "@/lib/mongodb";
import Post, { ICreatePostDto, IPost, IPostJson } from "@/models/Post";

export default async function handler(
  req: ApiRequest<ICreatePostDto>,
  res: ApiResponse<IPostJson | any>
) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case "GET":
      try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        res
          .status(400)
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
