import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import Post, { IPost } from '../../../models/Post';

type Data = {
  success: boolean;
  data?: IPost | IPost[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to fetch posts' });
      }
      break;
    case 'POST':
      try {
        const post = await Post.create(req.body as IPost);
        res.status(201).json({ success: true, data: post });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to create post' });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}