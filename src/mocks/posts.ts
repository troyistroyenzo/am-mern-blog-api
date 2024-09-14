import { mongo } from "mongoose";

export const mockPosts = [
  {
    title: "First post",
    content: "Sample content",
    _id: new mongo.ObjectId().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Second post",
    content: "Sample content",
    _id: new mongo.ObjectId().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockPost = mockPosts[0];
export const mockNotFoundPostId = new mongo.ObjectId();
