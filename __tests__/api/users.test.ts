import { ICreateUserDto, IUserDto } from "@/models/User";
import handler, { Data } from "@/pages/api/users/[[...id]]";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

const mockUser: IUserDto = {
  _id: "someUserId",
  username: "admin",
  __v: 0,
};

jest.mock("@/models/User", () => ({
  create: jest.fn((data: ICreateUserDto) => ({ ...mockUser, ...data })),
  findOne: jest.fn(() => ({ ...mockUser, passwordHash: "some-hash-pw" })),
}));

describe("/api/users", () => {
  it("should create a new user", async () => {
    // setup
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data>>({
      method: "POST",
      body: {
        username: "admin",
        password: "admin",
        reEnterPassword: "admin",
      },
    });

    // execute
    await handler(req, res);

    // assert
    expect(res._getStatusCode()).toStrictEqual(201);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        ...mockUser,
        token: "some-token",
      },
    });
  });

  it("should login an existing user", async () => {
    // setup
    const { req, res } = createMocks<NextApiRequest, NextApiResponse<Data>>({
      method: "POST",
      body: {
        username: "admin",
        password: "admin",
      },
      query: {
        id: "login",
      },
    });

    // execute
    await handler(req, res);

    // assert
    expect(res._getStatusCode()).toStrictEqual(200);
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      data: {
        ...mockUser,
        token: "some-token",
      },
    });
  });
});
