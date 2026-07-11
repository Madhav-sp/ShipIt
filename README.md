# Deployr

Deployr is a Vercel-inspired deployment platform that automatically builds and deploys React/Vite applications from GitHub repositories.

A user logs in using GitHub OAuth, submits a GitHub repository, and Deployr builds the project inside a Docker container, uploads the generated build to AWS S3, serves it through CloudFront, and tracks deployment status in real time.

---

# Features

- GitHub OAuth Authentication
- GitHub Repository Deployment
- Docker-based Isolated Builds
- Automatic Framework Detection
- React + Vite Support
- Background Worker using BullMQ
- Redis Job Queue
- AWS S3 Deployment
- CloudFront CDN Integration
- Deployment Status Tracking
- Deployment Logs
- Delete Deployments
- User Dashboard
- Responsive UI

---

# Architecture

```
                Browser
                   │
                   ▼
            React Frontend
                   │
                   ▼
            Express API Server
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
 GitHub OAuth              PostgreSQL
(Passport.js)               (Prisma)

                   │
                   ▼
              BullMQ Queue
                   │
                   ▼
             Worker Process
                   │
                   ▼
           Docker Builder Image
                   │
                   ▼
          Build React/Vite Project
                   │
                   ▼
                AWS S3
                   │
                   ▼
             CloudFront CDN
```

---

# Project Structure

```
ShipIt/

apps/

    api/
        src/
            index.js
            githubAuth.js
            authMiddleware.js
            prisma.js
            s3.js

    worker/
        src/
            deploy.js
            worker.js
            uploader.js
            framework.js

        builder/
            Dockerfile
            index.js

    frontend/
        src/
            components/
            pages/
            lib/

prisma/

ecosystem.config.js

package.json

README.md
```

---

# Tech Stack

## Frontend

- React
- Vite
- TailwindCSS
- Axios
- React Router

## Backend

- Node.js
- Express
- Passport.js
- GitHub OAuth
- BullMQ
- Redis
- Prisma ORM

## Database

- PostgreSQL

## Cloud

- AWS EC2
- AWS S3
- AWS CloudFront

## Infrastructure

- Docker
- PM2
- Nginx
- SSL (Let's Encrypt)

---

# Authentication

Deployr uses GitHub OAuth.

Flow

```
User

↓

GitHub Login

↓

GitHub OAuth

↓

Passport

↓

Session Stored

↓

Dashboard
```

---

# Deployment Flow

```
User enters GitHub Repository

↓

API creates Deployment

↓

Status = QUEUED

↓

BullMQ Queue

↓

Worker picks Job

↓

Docker Container Starts

↓

Clone Repository

↓

npm install

↓

npm run build

↓

Copy dist folder

↓

Upload to S3

↓

CloudFront URL Generated

↓

Deployment Status = SUCCESS
```

---

# Deployment States

- QUEUED
- BUILDING
- SUCCESS
- FAILED

---

# AWS Services Used

## EC2

Runs:

- API
- Worker
- Redis
- Docker

## S3

Stores static website files.

Example

```
bucket/

project-id/

    index.html
    assets/
```

## CloudFront

Serves deployments globally.

Example

```
https://xxxxxxxx.cloudfront.net/project-id/index.html
```

---

# Docker Builder

Every deployment runs inside an isolated Docker container.

Builder Steps

```
Clone Repository

↓

Install Dependencies

↓

Build Project

↓

Copy dist

↓

Return Build
```

---

# Queue System

Deployr uses BullMQ.

```
API

↓

Add Job

↓

Redis

↓

Worker

↓

Deploy
```

---

# Database

## Deployment Table

```
id

repoUrl

status

framework

deploymentUrl

logs

createdAt

userId
```

## User Table

```
id

githubId

username

avatarUrl
```

---

# Security

- Helmet
- Rate Limiting
- Session Authentication
- Protected Routes
- User Ownership Validation

---

# Nginx

```
Frontend

/

↓

React App

API

/api

↓

Express
```

---

# Deployment Logs

Example

```
Starting Build

Cloning Repository

Installing Dependencies

Building Project

Framework: React + Vite

Uploading to S3

Deployment Successful
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/yourusername/ShipIt.git
```

Install dependencies

```bash
npm install
```

API

```bash
cd apps/api
npm install
```

Worker

```bash
cd apps/worker
npm install
```

Frontend

```bash
cd apps/frontend
npm install
```

---

# Environment Variables

## API

```env
DATABASE_URL=

SESSION_SECRET=

GITHUB_CLIENT_ID=

GITHUB_CLIENT_SECRET=

GITHUB_CALLBACK_URL=

FRONTEND_URL=
```

## Worker

```env
AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_REGION=

S3_BUCKET_NAME=

CLOUDFRONT_URL=

REDIS_HOST=

REDIS_PORT=
```

---

# Running the Project

API

```bash
npm run dev
```

Worker

```bash
node src/worker.js
```

Frontend

```bash
npm run dev
```

---

# Production

Build Frontend

```bash
npm run build
```

Start PM2

```bash
pm2 start ecosystem.config.js
```

Restart Services

```bash
pm2 restart all
```

Restart Nginx

```bash
sudo systemctl restart nginx
```

---

# Future Improvements

- Custom Domains
- Automatic SSL
- Deployment Preview URLs
- Live Deployment Logs
- Multiple Framework Support
- Next.js SSR
- Astro
- Vue
- Angular
- Monorepo Support
- Team Workspaces
- GitHub Webhooks
- Automatic Deployments on Push
- Deployment Analytics
- Rollbacks
- Build Cache
- Docker Layer Cache
- Parallel Builds

---

# Author

**Madhav**

MERN Stack Developer

Built using Node.js, React, Docker, AWS, Redis, BullMQ, Prisma, and PostgreSQL.
