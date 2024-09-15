/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: All about posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         __v:
 *           type: number
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedPost:
 *       type: object
 *       properties:
 *         prevPage:
 *           type: number
 *         nextPage:
 *           type: number
 *         posts:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Post'
 *     ApiResponseSuccessPost:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: true
 *         data:
 *           $ref: '#/components/schemas/Post'
 *     ApiResponseSuccessPaginatedPost:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: true
 *         data:
 *             $ref: '#/components/schemas/PaginatedPost'
 *     ApiResponseError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: false
 *         error:
 *           type: string
 *     CreatePost:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *     UpdatePost:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 */

import { withSwagger } from "next-swagger-doc";

const swaggerHandler = withSwagger({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Automax AI Posts API Documentation",
      version: "0.0.1",
    },
  },
  apiFolder: "src/pages/api",
});
export default swaggerHandler();
