import queryString from "query-string";
import { createMocks } from "node-mocks-http";

import handler from "@/pages/api/posts";
import { mockPost, mockPosts } from "@/mocks/posts";
import Post, { ICreatePostDto, IPostJson } from "@/models/Post";

jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("query-string", () => ({
  parseUrl: jest.fn(() => ({ url: "", query: {} })),
}));

jest.mock("@/models/Post", () => ({
  find: jest.fn(({ title }) => {
    if (title) {
      return mockPosts.filter((post) => post.title === title);
    } else {
      return mockPosts;
    }
  }),
  create: jest.fn(({ title, content }) => {
    if (!title || !content) {
      throw new Error("Post validation error: title: ... , content: ...");
    }
    return { ...mockPost, title, content };
  }),
}));

describe("POST /api/posts", () => {
  it("should create a new post", async () => {
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

  it("should return error when invalid title and content", async () => {
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
    expect(error).toContain("Post validation error");
  });
  it("should return error for server-related errors", async () => {
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

  it("should return filtered posts", async () => {
    jest
      .spyOn(queryString, "parseUrl")
      .mockReturnValueOnce({ url: "", query: { title: mockPost.title } });

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPostJson[]>
    >({
      method: "GET",
      query: {
        title: mockPost.title,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const { success, data } = res._getJSONData();
    expect(success).toBe(true);
    expect(data).toStrictEqual([mockPost]);
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
