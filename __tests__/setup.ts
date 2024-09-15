jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  hashPassword: jest.fn(
    () => new Promise((resolve) => resolve("some-hash-pw"))
  ),
  verifyPassword: jest.fn(() => new Promise((resolve) => resolve(true))),
  generateToken: jest.fn(() => "some-token"),
}));

jest.mock("@/middlewares/authGuard", () => jest.fn());
jest.mock("@/middlewares/rateLimit", () => jest.fn());
jest.mock("@/middlewares/methodNotAllowed", () => jest.fn(() => jest.fn()));
