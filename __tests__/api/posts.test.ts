import { mongo } from "mongoose";
import queryString from "query-string";
import { createMocks } from "node-mocks-http";

import handler from "@/pages/api/posts";
import Post, { ICreatePostDto, IPostJson } from "@/models/Post";

const mockPosts = [
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

const mockPost = mockPosts[0];

jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("query-string", () => ({
  parseUrl: jest.fn(),
}));

describe("POST /api/posts", () => {
  it("should create a new post", async () => {
    //@ts-ignore
    jest.spyOn(Post, "create").mockReturnValueOnce(mockPost);

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto>,
      ApiResponse<IPostJson | IPostJson[]>
    >({
      method: "POST",
      body: {
        title: mockPost.title,
        content: mockPost.content,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const { success, data } = res._getJSONData();
    expect(success).toBe(true);
    expect(data).toStrictEqual(mockPost);
  });

  it("should throw error when invalid title and content", async () => {
    const err = new Error("Post validation error: title: ... , content: ...");
    jest.spyOn(Post, "create").mockRejectedValueOnce(err);

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto>,
      ApiResponse<IPostJson | IPostJson[]>
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
      ApiResponse<IPostJson | IPostJson[]>
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

describe("GET /api/posts", () => {
  it("should return list of posts", async () => {
    jest.spyOn(Post, "find").mockResolvedValueOnce(mockPosts);
    jest
      .spyOn(queryString, "parseUrl")
      .mockReturnValueOnce({ url: "", query: {} });

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPostJson[]>
    >({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const { success, data } = res._getJSONData();
    expect(success).toBe(true);
    expect(data).toStrictEqual(mockPosts);
  });

  it("should return filter posts", async () => {
    jest
      .spyOn(Post, "find")
      //@ts-ignore
      .mockImplementationOnce(({ title }) => {
        //@ts-ignore
        return mockPosts.filter((post) => post.title === title);
      });
    jest
      .spyOn(queryString, "parseUrl")
      .mockReturnValueOnce({ url: "", query: { title: "First post" } });

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPostJson[]>
    >({
      method: "GET",
      query: {
        title: mockPosts[0].title,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const { success, data } = res._getJSONData();
    expect(success).toBe(true);
    expect(data).toStrictEqual([mockPosts[0]]);
  });

  it("should throw error for server-related errors", async () => {
    jest.spyOn(Post, "find").mockRejectedValueOnce(new Error());

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto>,
      ApiResponse<IPostJson | IPostJson[]>
    >({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const { success, error } = res._getJSONData();
    expect(success).toBe(false);
    expect(error).toBe("Failed to fetch posts");
  });
});
