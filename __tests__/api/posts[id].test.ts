import { createMocks } from "node-mocks-http";

import handler from "@/pages/api/posts/[id]";
import { mockPost, mockPosts } from "@/mocks/posts";
import { IPostJson, IUpdatePostDto } from "@/models/Post";

jest.mock("@/models/Post", () => ({
  findById: jest.fn((id) => mockPosts.find((post) => post._id === id)),
  findByIdAndUpdate: jest.fn((_, data) => ({ ...mockPost, ...data })),
  findByIdAndDelete: jest.fn((id) => mockPost),
}));

describe("GET", () => {
  it("should return a post", async () => {
    const { req, res } = createMocks<
      ApiRequest<IUpdatePostDto | undefined>,
      ApiResponse<IPostJson>
    >({
      method: "GET",
      query: {
        id: mockPost._id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: mockPost,
    });
  });
});

describe("PUT", () => {
  it("should update an existing post", async () => {
    const { req, res } = createMocks<
      ApiRequest<IUpdatePostDto | undefined>,
      ApiResponse<IPostJson>
    >({
      method: "PUT",
      query: {
        id: mockPost._id,
      },
      body: {
        title: "Updated title",
        content: "Updated content",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: { ...mockPost, title: "Updated title", content: "Updated content" },
    });
  });
});

describe("DELETE", () => {
  it("should delete an existing post", async () => {
    const { req, res } = createMocks<
      ApiRequest<IUpdatePostDto | undefined>,
      ApiResponse<IPostJson>
    >({
      method: "DELETE",
      query: {
        id: mockPost._id,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: mockPost,
    });
  });
});

describe("Not supported methods", () => {
  it("should not work for POST", async () => {
    const { req, res } = createMocks<
      ApiRequest<IUpdatePostDto | undefined>,
      ApiResponse<IPostJson>
    >({
      method: "POST",
      query: {
        id: mockPost._id,
      },
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
});
