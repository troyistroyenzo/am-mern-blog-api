import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { createSwaggerSpec } from "next-swagger-doc";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const SwaggerUI = dynamic<{
  spec: any;
  //@ts-ignore
}>(import("swagger-ui-react"), { ssr: false });

function ApiDocs({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Automax AI Posts API Documentation",
        description: "Automax AI Posts API Documentation",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      tags: [
        {
          name: "Posts",
        },
        {
          name: "Users",
        },
      ],
      paths: {
        "/api/users": {
          post: {
            security: [],
            tags: ["Users"],
            summary: "Create a new user",
            description: "Create a new user",
            operationId: "createUser",
            requestBody: {
              description: "Create a new user",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateUser",
                  },
                },
              },
              required: true,
            },
            responses: {
              "201": {
                description: "User created",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseSuccessUser",
                    },
                  },
                },
              },
              "400": {
                description: "Invalid input",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "500": {
                description: "Internal server error",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/users/login": {
          post: {
            security: [],
            tags: ["Users"],
            summary: "Login user",
            description: "Login user",
            operationId: "loginUser",
            requestBody: {
              description: "Login user",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/LoginUser",
                  },
                },
              },
              required: true,
            },
            responses: {
              "200": {
                description: "User logged in",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseSuccessUser",
                    },
                  },
                },
              },
              "400": {
                description: "Invalid input",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "500": {
                description: "Internal server error",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/posts": {
          get: {
            tags: ["Posts"],
            summary: "Returns list of posts",
            description: "Returns list of posts",
            operationId: "listPosts",
            parameters: [
              {
                name: "limit",
                in: "query",
                required: false,
                schema: {
                  type: "number",
                },
              },
              {
                name: "page",
                in: "query",
                required: false,
                schema: {
                  type: "number",
                },
              },
            ],
            responses: {
              "200": {
                description: "List of posts",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseSuccessPostArray",
                    },
                  },
                },
              },
              "401": {
                description: "Not authenticated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "500": {
                description: "Internal server error",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Posts"],
            summary: "Add new post",
            description: "Add new post",
            operationId: "addPost",
            requestBody: {
              description: "Add new post",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreatePost",
                  },
                },
              },
              required: true,
            },
            responses: {
              "201": {
                description: "Post created",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseSuccessPost",
                    },
                  },
                },
              },
              "400": {
                description: "Invalid input",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "401": {
                description: "Not authenticated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "500": {
                description: "Internal server error",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/posts/{id}": {
          get: {
            tags: ["Posts"],
            summary: "Returns post by id",
            description: "Returns post by id",
            operationId: "getPost",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "A post",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseSuccessPost",
                    },
                  },
                },
              },
              "400": {
                description: "Invalid post id",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "401": {
                description: "Not authenticated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "404": {
                description: "Post does not exist",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "500": {
                description: "Internal server error",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
            },
          },
          put: {
            tags: ["Posts"],
            summary: "Updates post by id",
            description: "Updates post by id",
            operationId: "updatePost",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              description: "Update post",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UpdatePost",
                  },
                },
              },
              required: true,
            },
            responses: {
              "200": {
                description: "Updated post",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseSuccessPost",
                    },
                  },
                },
              },
              "400": {
                description: "Invalid post id or input",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "401": {
                description: "Not authenticated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "404": {
                description: "Post does not exist",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "500": {
                description: "Internal server error",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
            },
          },
          delete: {
            tags: ["Posts"],
            summary: "Deletes post by id",
            description: "Deletes post by id",
            operationId: "deletePost",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Deleted post",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseSuccessPost",
                    },
                  },
                },
              },
              "400": {
                description: "Invalid post id",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "401": {
                description: "Not authenticated",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "404": {
                description: "Post does not exist",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
              "500": {
                description: "Internal server error",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ApiResponseError",
                    },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              username: {
                type: "string",
              },
              token: {
                type: "string",
              },
              _id: {
                type: "string",
              },
              __v: {
                type: "string",
              },
            },
          },
          CreateUser: {
            type: "object",
            properties: {
              username: {
                type: "string",
              },
              password: {
                type: "string",
              },
              reEnterPassword: {
                type: "string",
              },
            },
          },
          LoginUser: {
            type: "object",
            properties: {
              username: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
          },
          ApiResponseSuccessUser: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                default: true,
              },
              data: {
                $ref: "#/components/schemas/User",
              },
            },
          },
          Post: {
            type: "object",
            properties: {
              _id: {
                type: "string",
              },
              __v: {
                type: "number",
              },
              title: {
                type: "string",
              },
              content: {
                type: "string",
              },
              createdAt: {
                type: "string",
                format: "date-time",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
              },
            },
          },
          PaginatedPost: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Post",
                },
              },
              prevPage: {
                type: "number",
                nullable: true,
              },
              currPage: {
                type: "number",
                nullable: true,
              },
              nextPage: {
                type: "number",
                nullable: true,
              },
              count: {
                type: "number",
                nullable: true,
              },
            },
          },
          ApiResponseSuccessPost: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                default: true,
              },
              data: {
                $ref: "#/components/schemas/Post",
              },
            },
          },
          ApiResponseSuccessPostArray: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                default: true,
              },
              data: {
                $ref: "#/components/schemas/PaginatedPost",
              },
            },
          },
          ApiResponseError: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                default: false,
              },
              error: {
                type: "string",
              },
            },
          },
          CreatePost: {
            type: "object",
            properties: {
              title: {
                type: "string",
              },
              content: {
                type: "string",
              },
            },
          },
          UpdatePost: {
            type: "object",
            properties: {
              title: {
                type: "string",
              },
              content: {
                type: "string",
              },
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDocs;
