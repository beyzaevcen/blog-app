# Blog Application

A comprehensive blog application developed using modern web technologies.

## Technologies

- **Frontend**: React
- **Backend**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Features

- User registration and login
- Create, read, update, and delete blog posts
- Rich text editor
- Responsive design

## Application Screenshots


<img src="https://github.com/user-attachments/assets/03d6e874-0f59-45b8-b32e-0dc3f298f2e3" width="500" alt="home">

<img src="https://github.com/user-attachments/assets/a91ca545-4215-48fa-9524-7cc88bd42a1d" width="500" alt="create">

<img src="https://github.com/user-attachments/assets/5ca1f204-66bd-4cda-a890-6e0ff06af686" width="500" alt="blog">


## Installation

### Requirements

- Node.js (v14.0.0 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/username/blog-app.git
cd blog-app/api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit the .env file to set MongoDB URI and JWT secret values

# Start the server
npm start
```

### Frontend Setup

```bash
# Go to the main directory
cd ../client

# Install dependencies
npm install

# Start the development server
npm start
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - User profile

### Blog Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post



---

Developer: [Nermin Beyzanur Evcen](https://github.com/beyzaevcen)
