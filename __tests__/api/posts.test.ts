import queryString from "query-string";
import { createMocks } from "node-mocks-http";

import handler from "@/pages/api/posts";
import { mockPost, mockPosts } from "@/mocks/posts";
import { ICreatePostDto, IPaginatedPostJson, IPostJson } from "@/models/Post";

jest.mock("@/models/Post", () => ({
  find: jest.fn(() => mockPosts),
  create: jest.fn((post) => {
    if (!post.title || !post.content) throw new Error("Post validation error");

    return { ...mockPost, ...post };
  }),
}));

describe("GET /api/posts", () => {
  it("should return a list of posts", async () => {
    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPaginatedPostJson>
    >({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        prevPage: null,
        nextPage: null,
        posts: mockPosts,
      },
    });
  });

  it("should return paginated posts", async () => {
    jest
      .spyOn(queryString, "parseUrl")
      //@ts-ignore
      .mockReturnValueOnce({ url: "", query: { limit: 2, page: 1 } });

    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPaginatedPostJson>
    >({
      method: "GET",
      query: {
        limit: 2,
        page: 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    console.log(res._getJSONData());
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        prevPage: null,
        nextPage: 2,
        posts: mockPosts,
      },
    });
  });
});

describe("POST /api/posts", () => {
  it("should create a post", async () => {
    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPaginatedPostJson>
    >({
      method: "POST",
      body: {
        title: mockPost.title,
        content: mockPost.content,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: mockPost,
    });
  });

  it("should return an error if invalid request body", async () => {
    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPaginatedPostJson>
    >({
      method: "POST",
      body: undefined,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      success: false,
      error: "Post json data is required",
    });
  });

  it("should return an error if invalid post title and/or content", async () => {
    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPaginatedPostJson>
    >({
      method: "POST",
      body: {
        title: "",
        content: " ",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      success: false,
      error: "Post validation error",
    });
  });
});

describe("Not supported methods", () => {
  it("should not work for PUT", async () => {
    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPaginatedPostJson>
    >({
      method: "PUT",
      body: {
        title: "New title",
        content: "New content",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toStrictEqual({
      success: false,
      error: "Method not allowed",
    });
  });
  it("should not work for DELETE", async () => {
    const { req, res } = createMocks<
      ApiRequest<ICreatePostDto | undefined>,
      ApiResponse<IPostJson | IPaginatedPostJson>
    >({
      method: "DELETE",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toStrictEqual({
      success: false,
      error: "Method not allowed",
    });
  });
});
