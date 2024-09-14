/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Returns post by id
 *     description: Returns a post by its ID.
 *     operationId: getPost
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccessPost'
 *       '400':
 *         description: Invalid post ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 *       '404':
 *         description: Post does not exist
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
 *   put:
 *     tags:
 *       - Posts
 *     summary: Updates post by id
 *     description: Updates a post by its ID.
 *     operationId: updatePost
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The post data to update
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePost'
 *       required: true
 *     responses:
 *       '200':
 *         description: Updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccessPost'
 *       '400':
 *         description: Invalid post ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 *       '404':
 *         description: Post does not exist
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
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Deletes post by id
 *     description: Deletes a post by its ID.
 *     operationId: deletePost
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Deleted post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccessPost'
 *       '400':
 *         description: Invalid post ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 *       '404':
 *         description: Post does not exist
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
 */

import { connectToDatabase } from "@/lib/mongodb";
import Post, { IPostJson, IUpdatePostDto } from "@/models/Post";

const executor = {
  GET: (id: string) => Post.findById(id),
  PUT: (id: string, data: IUpdatePostDto) =>
    Post.findByIdAndUpdate(id, data, { new: true }),
  DELETE: (id: string) => Post.findByIdAndDelete(id),
};
export default async function handler(
  req: ApiRequest<IUpdatePostDto | undefined>,
  res: ApiResponse<IPostJson>
) {
  const { method, body } = req;
  const { id } = req.query;

  try {
    await connectToDatabase();
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  if (typeof id !== "string") {
    throw new Error("Post id is required");
  }

  try {
    let result;
    switch (method) {
      case "GET":
      case "DELETE":
        result = await executor[method](id);
        break;
      case "PUT":
        if (!body) {
          throw new Error("Post json data is required");
        }
        result = await executor["PUT"](id, body);
        break;
      default:
        throw new Error("Method not allowed");
    }
    if (!result) {
      throw new Error("Post does not exists");
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error) {
      let statusCode;
      if (err.message === "Post does not exists") {
        statusCode = 404;
      } else if (err.message === "Method not allowed") {
        statusCode = 405;
      } else {
        statusCode = 400;
      }
      res.status(statusCode).json({ success: false, error: err.message });
    }
  }
}
