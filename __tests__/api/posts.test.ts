import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import handler from '../../src/pages/api/posts';

jest.mock('../../src/lib/mongodb', () => ({
  connectToDatabase: jest.fn(),
}));

describe('/api/posts', () => {
  it('creates a new post', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        title: 'Test Post',
        content: 'This is a test post.',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        success: true,
      })
    );
  });

  // Add more tests for GET, PUT, and DELETE methods
});