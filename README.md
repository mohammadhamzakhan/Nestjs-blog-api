# Blog API (NestJS + Prisma + PostgreSQL)

A **scalable and modular Blog API** built with **NestJS** and **Prisma ORM**.  
This API supports **authentication, user management, blog creation, image uploads, and comments** with clear role-based access control for **Admins and Users**.

Designed for **performance, maintainability, and developer experience**.

---

## Features

- **JWT Authentication** (Sign Up / Sign In)
- **User Profiles** (create, edit, delete, get profile)
- **Blogs** (create, update, delete, get all blogs, single blog, admin management)
- **Image Uploads** for blogs
- **Comments** (create, edit, delete, get comments, admin moderation)
- **Role-Based Access Control** (User & Admin)
- **Swagger API Docs** for testing and exploring endpoints
- **Prisma ORM** with PostgreSQL for type-safe database queries

---

## API Routes

### Authentication & User

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| POST   | `/auth/signUp`      | Register a new user   |
| POST   | `/auth/signIn`      | Login & get JWT token |
| GET    | `/user/me`          | Get my profile (self) |
| PATCH  | `/user/me`          | Edit my profile       |
| DELETE | `/user/me`          | Delete my profile     |
| GET    | `/user/all` (Admin) | Get all users         |
| GET    | `/user/:id` (Admin) | Get user by ID        |
| DELETE | `/user/:id` (Admin) | Delete user by ID     |

---

### Blogs

| Method | Endpoint                 | Description                    |
| ------ | ------------------------ | ------------------------------ |
| POST   | `/blog/create`           | Create a blog (User/Admin)     |
| POST   | `/uploads/image`         | Upload blog image              |
| GET    | `/blog/me`               | Get my blogs                   |
| GET    | `/blog/me/:id`           | Get single blog (by ID)        |
| PATCH  | `/blog/me/:id`           | Edit my blog                   |
| DELETE | `/blog/me/:id`           | Delete my blog                 |
| GET    | `/blog/getB/:id` (Admin) | Get blog by ID (Admin only)    |
| PATCH  | `/blog/getB/:id` (Admin) | Edit blog by ID (Admin only)   |
| DELETE | `/blog/getB/:id` (Admin) | Delete blog by ID (Admin only) |

---

### Comments

| Method | Endpoint                          | Description                        |
| ------ | --------------------------------- | ---------------------------------- |
| POST   | `/comments/:postId`               | Create a comment on a blog         |
| GET    | `/comments/:postId`               | Get all comments for a blog        |
| PATCH  | `/comments/:id`                   | Edit a comment by ID               |
| DELETE | `/comments/:id`                   | Delete a comment by ID             |
| DELETE | `/comments/all/:postId`           | Delete all comments for a blog     |
| DELETE | `/comments/admin/:postId` (Admin) | Admin deletes all comments on blog |

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/mohammadhamzakhan/Nestjs-blog-api.git
cd blog-api
```
