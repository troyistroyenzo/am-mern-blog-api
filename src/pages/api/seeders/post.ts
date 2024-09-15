import { faker } from "@faker-js/faker";

import Post, { IPostJson } from "@/models/Post";

export default async function (
  req: ApiRequest<undefined>,
  res: ApiResponse<{ count: number }>
) {
  const { method } = req;

  if (method !== "GET") {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { count } = req.query;
  if (!count && !Number.isInteger(count)) {
    res.status(400).json({ success: false, error: "Count is required" });
  }

  try {
    const posts: IPostJson[] = Array.from(Array(Number(count))).map((_) => ({
      _id: faker.database.mongodbObjectId(),
      __v: 0,
      title: faker.word.words({ count: 2 }),
      content: faker.word.words({ count: 10 }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    const result = await Post.create(posts);
    res.status(200).json({
      success: true,
      data: {
        count: result.length,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
