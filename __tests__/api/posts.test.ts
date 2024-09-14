import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/posts";
import Post, { ICreatePostDto, IPost, IPostJson } from "@/models/Post";
import { mockPost } from "./posts.mock";

jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

describe("POST /api/posts", () => {
  it("should create a new post", async () => {
    const post = mockPost("New post", "New post content");
    jest.spyOn(Post, "create").mockReturnValueOnce(post as any);

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto>,
      ApiResponse<IPostJson>
    >({
      method: "POST",
      body: {
        title: post.title,
        content: post.content,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const { success, data } = res._getJSONData();
    expect(success).toBe(true);
    expect(data).toStrictEqual(post);
  });

  it("should throw error when invalid title and content", async () => {
    const err = new Error("Post validation error: title: ... , content: ...");
    jest.spyOn(Post, "create").mockRejectedValueOnce(err);

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto>,
      ApiResponse<IPostJson>
    >({
      method: "POST",
      body: {
        title: "",
        content: "",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const { success, error } = res._getJSONData();
    expect(success).toBe(false);
    expect(error).toBe(err.message);
  });
  it("should throw error for server-related errors", async () => {
    jest.spyOn(Post, "create").mockRejectedValueOnce(new Error());

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto>,
      ApiResponse<IPostJson>
    >({
      method: "POST",
      body: {
        title: "Correct title",
        content: "Correct content",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const { success, error } = res._getJSONData();
    expect(success).toBe(false);
    expect(error).toBe("Failed to create post");
  });
});
