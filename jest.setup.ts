import { jest } from "@jest/globals";

jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("query-string", () => ({
  parseUrl: jest.fn(() => ({ url: "", query: {} })),
}));
