import { connectToDatabase } from "@/lib/mongodb";
import Post, { ICreatePostDto, IPostJson } from "@/models/Post";

export default async function handler(
  req: ApiRequest<ICreatePostDto | undefined>,
  res: ApiResponse<IPostJson>
) {
  const { method } = req;
  const { id } = req.query;

  await connectToDatabase();

  switch (method) {
    case "GET":
      try {
        const post = await Post.findById(id);
        if (!post) throw new Error("Post does not exists");
        res.status(200).json({ success: true, data: post });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Cast to ObjectId failed")
        ) {
          res.status(400).json({
            success: false,
            error: "Invalid post id format",
          });
        } else if (
          error instanceof Error &&
          error.message.includes("Post does not exists")
        ) {
          res.status(404).json({
            success: false,
            error: error.message,
          });
        } else {
          res
            .status(500)
            .json({ success: false, error: "Failed to fetch post" });
        }
      }
      break;
    case "PUT":
      break;
    case "DELETE":
      break;
    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
