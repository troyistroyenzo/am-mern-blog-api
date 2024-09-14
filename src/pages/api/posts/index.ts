/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Returns list of posts
 *     description: Returns a list of posts.
 *     operationId: listPosts
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         default: 10
 *         schema:
 *           type: number
 *         description: Number of posts to return in the list
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         default: 1
 *         description: The current page of posts
 *     responses:
 *       '200':
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccessPaginatedPost'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 *   post:
 *     tags:
 *       - Posts
 *     summary: Adds new post
 *     description: Adds a new post.
 *     operationId: addPost
 *     requestBody:
 *       description: The post to create
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *       required: true
 *     responses:
 *       '201':
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccessPost'
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 * */

import jwt from "jsonwebtoken";
import queryString from "query-string";

import { ApiPagination } from "types/api";
import { connectToDatabase } from "@/lib/mongodb";
import Post, {
  ICreatePostDto,
  IPaginatedPostJson,
  IPostJson,
} from "@/models/Post";

const executor = {
  GET: ({ limit, page }: ApiPagination) =>
    Post.find({}, undefined, { limit: limit, skip: (page - 1) * limit }),
  POST: (data: ICreatePostDto) => Post.create(data),
};

export default async function handler(
  req: ApiRequest<ICreatePostDto | undefined>,
  res: ApiResponse<IPostJson | IPaginatedPostJson>
) {
  const { method, url, body, headers } = req;

  const { authorization } = headers;

  if (!authorization) {
    res.status(401).json({ success: false, error: "Bearer token is required" });
    return;
  }

  const authParts = authorization.split(" ");
  const bearer = authParts[0];
  const token = authParts[1];

  if (bearer !== "Bearer" || !token) {
    res.status(401).json({ success: false, error: "Invalid bearer token" });
    return;
  }

  let user = null;
  jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
    if (decoded) {
      user = decoded;
    }
    if (err) {
      res.status(401).json({ success: false, error: "Token is invalid" });
    }
  });

  try {
    await connectToDatabase();
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
  try {
    let result;
    let statusCode;
    switch (method) {
      case "GET":
        const { query } = queryString.parseUrl(url || "", {
          parseNumbers: true,
        });
        const pagination: ApiPagination = { limit: 10, page: 1, ...query };
        const posts = await executor["GET"](pagination);
        result = {
          prevPage: pagination.page === 1 ? null : pagination.page - 1,
          nextPage:
            posts.length < pagination.limit ? null : pagination.page + 1,
          posts,
        };
        statusCode = 200;
        break;
      case "POST":
        if (!body || !Object.keys(body).length) {
          throw new Error("Post json data is required");
        }
        if (!user) {
          throw new Error("User is forbidden to create a post");
        }

        result = await executor["POST"](body);
        statusCode = 201;
        break;
      default:
        throw new Error("Method not allowed");
    }

    res.status(statusCode).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error) {
      let statusCode;
      if (err.message === "Method not allowed") {
        statusCode = 405;
      } else if (err.message === "User is forbidden to create post") {
        statusCode = 403;
      } else {
        statusCode = 400;
      }
      res.status(statusCode).json({ success: false, error: err.message });
    }
  }
}
