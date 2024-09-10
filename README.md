# Automax - MERN Stack Blog API Challenge

## Description

This repository contains the starter code for a take-home coding challenge focused on building a blog API using the MERN (MongoDB, Express.js, React, Node.js) stack with Next.js and TypeScript. The challenge is designed to assess your skills in backend development, API design, database integration, and TypeScript usage in a Next.js environment.

## Technologies

- Next.js
- TypeScript
- MongoDB with Mongoose
- Jest for testing

## Challenge Overview

Your task is to implement a RESTful API for a simple blog application. The API should support basic CRUD (Create, Read, Update, Delete) operations for blog posts. The starter code provides the basic project structure and database connection setup.

## Key Tasks

1. Implement API endpoints for blog posts (GET, POST, PUT, DELETE)
2. Integrate with MongoDB using Mongoose
3. Implement proper error handling and input validation
4. Write unit tests for your API endpoints
5. Document your API and code

## Bonus Features

- Implement pagination for the GET all posts endpoint
- Add authentication to protect certain endpoints
- Implement a simple rate limiting mechanism

## Getting Started

### Step 1: Fork the Repository

1. Log in to your GitHub account.
2. Navigate to this repository's page.
3. Click the "Fork" button in the top-right corner of the page.
4. Select where you want to fork the repository (your personal account or an organization).

### Step 2: Clone Your Forked Repository

1. On your forked repository's page, click the "Code" button and copy the URL.
2. Open your terminal and navigate to where you want to clone the repository.
3. Run the following command, replacing `<your-username>` with your GitHub username:

   ```
   git clone https://github.com/<your-username>/mern-blog-api-challenge.git
   ```

4. Navigate into the cloned repository:

   ```
   cd mern-blog-api-challenge
   ```

### Step 3: Install Dependencies

Install the necessary packages by running:

```
npm install
```

### Step 4: Set Up Environment Variables

1. In the root directory of the project, create a file named `.env.local`.
2. Add your MongoDB connection string to this file:

   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

### Step 5: Start the Development Server

Run the following command to start the Next.js development server:

```
npm run dev
```

The server should now be running at `http://localhost:3000`.

### Step 6: Begin Implementing the Required Features

You can now start working on the challenge. Remember to commit your changes regularly and push them to your forked repository.

## Submitting Your Solution

When you've completed the challenge:

1. Ensure all your changes are committed and pushed to your forked repository.
2. Send us the link to your forked repository for review.

## Evaluation Criteria

- Code quality and organization
- Proper use of TypeScript and Next.js API routes
- Database integration and query efficiency
- Error handling and input validation
- Test coverage and quality
- Documentation clarity

Good luck with your implementation! We look forward to seeing your solution.