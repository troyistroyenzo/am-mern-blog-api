import { mongo } from "mongoose";
import { createMocks } from "node-mocks-http";

import handler from "@/pages/api/posts/[id]";
import Post, { IPostJson } from "@/models/Post";
import { mockNotFoundPostId, mockPost, mockPosts } from "@/mocks/posts";

jest.mock("@/models/Post", () => ({
  findById: jest.fn((id) => {
    if (mongo.ObjectId.isValid(id)) {
      return mockPosts.find((post) => post._id === id);
    }
    throw new Error("Cast to ObjectId failed");
  }),
}));

jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

describe("GET /api/posts/:id", () => {
  it("should return a post", async () => {
    const { req, res } = createMocks<
      ApiRequest<undefined>,
      ApiResponse<IPostJson>
    >({
      method: "GET",
      query: {
        id: mockPost._id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const { success, data } = res._getJSONData();
    expect(success).toBe(true);
    expect(data).toStrictEqual(mockPost);
  });
  it("should return an error when post id is invalid", async () => {
    const { req, res } = createMocks<
      ApiRequest<undefined>,
      ApiResponse<IPostJson>
    >({
      method: "GET",
      query: {
        id: "invalid_id",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const { success, error } = res._getJSONData();
    expect(success).toBe(false);
    expect(error).toStrictEqual("Invalid post id format");
  });
  it("should return an error when post does not exists", async () => {
    const { req, res } = createMocks<
      ApiRequest<undefined>,
      ApiResponse<IPostJson>
    >({
      method: "GET",
      query: {
        id: mockNotFoundPostId,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    const { success, error } = res._getJSONData();
    expect(success).toBe(false);
    expect(error).toStrictEqual("Post does not exists");
  });
  it("should return an error for server-related errors", async () => {
    jest.spyOn(Post, "findById").mockRejectedValueOnce(new Error());

    const { req, res } = createMocks<
      ApiRequest<undefined>,
      ApiResponse<IPostJson>
    >({
      method: "GET",
      query: {
        id: mockPost._id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const { success, error } = res._getJSONData();
    expect(success).toBe(false);
    expect(error).toStrictEqual("Failed to fetch post");
  });
});
