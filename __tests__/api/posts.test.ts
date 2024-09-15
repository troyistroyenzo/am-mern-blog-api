import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

import { IPostDto, IUpdatePostDto } from "@/models/Post";
import handler, { Data } from "@/pages/api/posts/[[...id]]";

const mockPosts: IPostDto[] = [
  {
    _id: "someId",
    title: "Sample title",
    content: "Sample content",
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  },
];

const mockPost: IPostDto = {
  _id: "someId2",
  title: "Sample title 2",
  content: "Sample content 2",
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

jest.mock("@/models/Post", () => ({
  find: jest.fn(() => [mockPost]),
  create: jest.fn(() => mockPost),
  findById: jest.fn((id: string) =>
    [mockPost, ...mockPosts].find((post) => post._id === id)
  ),
  findByIdAndUpdate: jest.fn((id: string, data: IUpdatePostDto) => {
    const post = [mockPost, ...mockPosts].find((post) => post._id === id);
    if (post)
      return {
        ...post,
        ...data,
      };
    return null;
  }),
  findByIdAndDelete: jest.fn((id: string) =>
    [mockPost, ...mockPosts].find((post) => post._id === id)
  ),
}));

jest.mock("@/middlewares/authGuard", () => jest.fn());

describe("/api/posts", () => {
  it("should return the lists of posts as pagination", async () => {
    // setup
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data>>({
      method: "GET",
      query: {
        limit: 2,
        page: 1,
      },
    });

    // execute
    await handler(req, res);

    // assert
    expect(res._getStatusCode()).toStrictEqual(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        prevPage: 0,
        currPage: 1,
        nextPage: null,
        count: 1,
        items: [
          {
            ...mockPost,
            createdAt: mockPost.createdAt.toISOString(),
            updatedAt: mockPost.updatedAt.toISOString(),
          },
        ],
      },
    });
  });

  it("should create a new post", async () => {
    // setup
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data>>({
      method: "POST",
      body: {
        title: mockPost.title,
        content: mockPost.content,
      },
    });

    // execute
    await handler(req, res);

    // assert
    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        ...mockPost,
        createdAt: mockPost.createdAt.toISOString(),
        updatedAt: mockPost.updatedAt.toISOString(),
      },
    });
  });

  it("should return the post by id", async () => {
    // setup
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data>>({
      method: "GET",
      query: {
        id: mockPost._id,
      },
    });

    // execute
    await handler(req, res);

    // expect
    expect(res._getStatusCode()).toStrictEqual(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        ...mockPost,
        createdAt: mockPost.createdAt.toISOString(),
        updatedAt: mockPost.updatedAt.toISOString(),
      },
    });
  });

  it("should update an existing post", async () => {
    // setup
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data>>({
      method: "PUT",
      query: {
        id: mockPost._id,
      },
      body: {
        title: "Updated title",
        content: "Updated content",
      },
    });

    // execute
    await handler(req, res);

    // expect
    expect(res._getStatusCode()).toStrictEqual(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        ...mockPost,
        createdAt: mockPost.createdAt.toISOString(),
        updatedAt: mockPost.updatedAt.toISOString(),
        title: "Updated title",
        content: "Updated content",
      },
    });
  });

  it("should delete an existing post", async () => {
    // setup
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data>>({
      method: "DELETE",
      query: {
        id: mockPost._id,
      },
    });

    // execute
    await handler(req, res);

    // expect
    expect(res._getStatusCode()).toStrictEqual(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        ...mockPost,
        createdAt: mockPost.createdAt.toISOString(),
        updatedAt: mockPost.updatedAt.toISOString(),
      },
    });
  });
});
