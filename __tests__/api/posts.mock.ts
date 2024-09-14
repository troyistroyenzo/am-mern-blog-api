import { IPostJson } from "@/models/Post";
import { mongo } from "mongoose";

export const mockPost = (title: string, content: string): IPostJson => ({
  title: title,
  content: content,
  _id: new mongo.ObjectId().toString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
