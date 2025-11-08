# Backend Architecture

This document outlines the backend architecture, API design, and infrastructure components used by Monynha Softwares.

## Backend Overview

### Technology Stack

Monynha Softwares uses a modern, scalable backend architecture built on:

- **Primary Framework**: Node.js with TypeScript
- **Database**: PostgreSQL with Supabase
- **ORM**: Prisma ORM for type-safe database operations
- **API**: RESTful APIs with GraphQL support
- **Authentication**: Supabase Auth with JWT tokens
- **Real-time**: Supabase Realtime for live updates
- **Storage**: Supabase Storage for file uploads
- **Caching**: Redis for session and data caching

### Architecture Principles

- **Microservices**: Modular, independently deployable services
- **API-First**: Design APIs before implementing frontend
- **Type Safety**: Full TypeScript coverage across the stack
- **Security First**: Authentication, authorization, and data validation
- **Scalability**: Horizontal scaling with load balancing
- **Observability**: Comprehensive logging and monitoring

## API Architecture

### RESTful API Design

#### Resource-Based URLs

```
GET    /api/v1/users           # List users
POST   /api/v1/users           # Create user
GET    /api/v1/users/:id       # Get user by ID
PUT    /api/v1/users/:id       # Update user
DELETE /api/v1/users/:id       # Delete user
GET    /api/v1/users/:id/posts # Get user's posts
```

#### HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **204 No Content**: Successful request with no response body
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

#### Request/Response Format

```json
// Request
{
  "data": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Response
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "email": "Must be a valid email address"
    }
  }
}
```

### GraphQL API

#### Schema Definition

```graphql
type Query {
  users(limit: Int, offset: Int): [User!]!
  user(id: ID!): User
  posts(userId: ID, limit: Int, offset: Int): [Post!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  createPost(input: CreatePostInput!): Post!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  name: String
  email: String
}
```

#### Resolvers Implementation

```typescript
// User resolvers
export const userResolvers = {
  Query: {
    users: async (_: any, { limit = 10, offset = 0 }: { limit: number; offset: number }) => {
      return await prisma.user.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      });
    },

    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id }
      });
    }
  },

  Mutation: {
    createUser: async (_: any, { input }: { input: CreateUserInput }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      return await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword
        }
      });
    },

    updateUser: async (_: any, { id, input }: { id: string; input: UpdateUserInput }) => {
      return await prisma.user.update({
        where: { id },
        data: input
      });
    }
  },

  User: {
    posts: async (user: User) => {
      return await prisma.post.findMany({
        where: { authorId: user.id }
      });
    }
  }
};
```

## Database Architecture

### PostgreSQL Schema Design

#### Core Tables

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project members
CREATE TABLE project_members (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  assignee_id UUID REFERENCES users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Indexes and Constraints

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Partial indexes for active records
CREATE INDEX idx_active_projects ON projects(created_at) WHERE status = 'active';
CREATE INDEX idx_pending_tasks ON tasks(created_at) WHERE status IN ('todo', 'in_progress');

-- Unique constraints
ALTER TABLE project_members ADD CONSTRAINT unique_project_user UNIQUE (project_id, user_id);
```

### Prisma ORM

#### Schema Definition

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  passwordHash  String?
  emailVerified Boolean   @default(false)
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  ownedProjects Project[] @relation("ProjectOwner")
  memberships   ProjectMember[]
  assignedTasks Task[]

  @@map("users")
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  ownerId     String
  status      String   @default("active")
  settings    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  owner     User            @relation("ProjectOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  members   ProjectMember[]
  tasks     Task[]

  @@map("projects")
}

model ProjectMember {
  projectId String
  userId    String
  role      String   @default("member")
  joinedAt  DateTime @default(now())

  // Relations
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@map("project_members")
}

model Task {
  id          String   @id @default(uuid())
  projectId   String
  title       String
  description String?
  status      String   @default("todo")
  priority    String   @default("medium")
  assigneeId  String?
  dueDate     DateTime?
  tags        String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  project  Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee User?   @relation(fields: [assigneeId], references: [id])

  @@map("tasks")
}
```

#### Database Operations

```typescript
// User service
export class UserService {
  async createUser(data: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword
      }
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        ownedProjects: true,
        memberships: {
          include: {
            project: true
          }
        }
      }
    });
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data
    });
  }
}

// Project service
export class ProjectService {
  async createProject(ownerId: string, data: CreateProjectInput): Promise<Project> {
    return await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId
      }
    });
  }

  async getProjectWithMembers(projectId: string): Promise<Project | null> {
    return await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
        members: {
          include: {
            user: true
          }
        },
        tasks: true
      }
    });
  }

  async addMember(projectId: string, userId: string, role: string = 'member'): Promise<void> {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role
      }
    });
  }
}
```

## Authentication & Authorization

### Supabase Auth Integration

#### Authentication Flow

```typescript
// Auth service
export class AuthService {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) throw error;

    // Create user profile in database
    if (data.user) {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          name
        }
      });
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
}
```

#### JWT Token Handling

```typescript
// JWT middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token verification failed' });
  }
};

// Role-based authorization
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get user role from database
    // This would typically be cached or included in JWT
    const userRole = req.user.user_metadata?.role || 'user';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

### Row Level Security (RLS)

#### RLS Policies

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view projects they own or are members of" ON projects
  FOR SELECT USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Project owners can update their projects" ON projects
  FOR UPDATE USING (owner_id = auth.uid());

-- Tasks policies
CREATE POLICY "Users can view tasks in their projects" ON tasks
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in their projects" ON tasks
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks they are assigned to or in their projects" ON tasks
  FOR UPDATE USING (
    assignee_id = auth.uid() OR
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
      UNION
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );
```

## Real-time Features

### Supabase Realtime

#### Real-time Subscriptions

```typescript
// Real-time task updates
export class RealtimeService {
  subscribeToProjectTasks(projectId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`project-${projectId}-tasks`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .subscribe();

    return channel;
  }

  subscribeToProjectMembers(projectId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`project-${projectId}-members`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_members',
          filter: `project_id=eq.${projectId}`
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Real-time notifications
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`user-${userId}-notifications`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return channel;
  }
}
```

#### WebSocket Implementation

```typescript
// WebSocket server for real-time collaboration
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      const userId = this.getUserIdFromRequest(request);

      if (userId) {
        this.clients.set(userId, ws);

        ws.on('message', (message: Buffer) => {
          this.handleMessage(userId, message);
        });

        ws.on('close', () => {
          this.clients.delete(userId);
        });
      }
    });
  }

  private getUserIdFromRequest(request: IncomingMessage): string | null {
    // Extract user ID from JWT token in request headers
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) return null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      return decoded.sub;
    } catch {
      return null;
    }
  }

  private async handleMessage(userId: string, message: Buffer) {
    try {
      const data = JSON.parse(message.toString());

      switch (data.type) {
        case 'task_update':
          await this.handleTaskUpdate(userId, data);
          break;
        case 'cursor_position':
          this.broadcastCursorPosition(userId, data);
          break;
      }
    } catch (error) {
      console.error('WebSocket message handling error:', error);
    }
  }

  private broadcastCursorPosition(userId: string, data: any) {
    // Broadcast cursor position to other users in the same project
    const message = JSON.stringify({
      type: 'cursor_update',
      userId,
      position: data.position,
      timestamp: Date.now()
    });

    this.clients.forEach((client, clientId) => {
      if (clientId !== userId && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
```

## File Storage & Uploads

### Supabase Storage

#### File Upload Service

```typescript
// File upload service
export class FileUploadService {
  private readonly bucket = 'project-files';

  async uploadFile(file: File, projectId: string, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${projectId}/${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucket)
      .remove([filePath]);

    if (error) throw error;
  }

  async getFileUrl(filePath: string): Promise<string> {
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async listProjectFiles(projectId: string): Promise<any[]> {
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .list(projectId);

    if (error) throw error;
    return data || [];
  }
}
```

#### File Processing Pipeline

```typescript
// File processing with image optimization
export class FileProcessingService {
  async processImage(file: File): Promise<File> {
    // Resize and optimize image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        // Resize to max 1920px width maintaining aspect ratio
        const maxWidth = 1920;
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const processedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(processedFile);
          }
        }, 'image/jpeg', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  async generateThumbnails(file: File): Promise<File[]> {
    const sizes = [100, 300, 600];
    const thumbnails: File[] = [];

    for (const size of sizes) {
      const thumbnail = await this.resizeImage(file, size, size);
      thumbnails.push(thumbnail);
    }

    return thumbnails;
  }

  private async resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    // Image resizing logic
    return file; // Placeholder
  }
}
```

## Caching Strategy

### Redis Implementation

#### Cache Service

```typescript
// Redis cache service
export class CacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
    }
  }
}
```

#### Cache Keys Strategy

```typescript
// Cache key constants
export const CACHE_KEYS = {
  USER: (id: string) => `user:${id}`,
  USER_PROJECTS: (userId: string) => `user:${userId}:projects`,
  PROJECT: (id: string) => `project:${id}`,
  PROJECT_MEMBERS: (projectId: string) => `project:${projectId}:members`,
  PROJECT_TASKS: (projectId: string) => `project:${projectId}:tasks`,
  TASK: (id: string) => `task:${id}`,
  USER_SESSION: (userId: string) => `session:${userId}`,
};

// Cache TTL constants
export const CACHE_TTL = {
  USER: 3600,        // 1 hour
  PROJECT: 1800,     // 30 minutes
  TASK: 900,         // 15 minutes
  SESSION: 86400,    // 24 hours
};
```

#### Cache-Aside Pattern

```typescript
// Service with caching
export class CachedUserService {
  constructor(
    private userService: UserService,
    private cache: CacheService
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const cacheKey = CACHE_KEYS.USER(id);

    // Try cache first
    let user = await this.cache.get<User>(cacheKey);
    if (user) {
      return user;
    }

    // Cache miss - fetch from database
    user = await this.userService.getUserById(id);
    if (user) {
      await this.cache.set(cacheKey, user, CACHE_TTL.USER);
    }

    return user;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.userService.updateUser(id, data);

    // Invalidate cache
    const cacheKey = CACHE_KEYS.USER(id);
    await this.cache.delete(cacheKey);

    // Cache updated user
    await this.cache.set(cacheKey, user, CACHE_TTL.USER);

    return user;
  }
}
```

## Background Jobs & Queues

### Job Queue System

#### Bull Queue Implementation

```typescript
// Job queue service
import Queue from 'bull';
import { injectable } from 'inversify';

@injectable()
export class QueueService {
  private emailQueue: Queue.Queue;
  private fileQueue: Queue.Queue;

  constructor() {
    this.emailQueue = new Queue('email', process.env.REDIS_URL);
    this.fileQueue = new Queue('file-processing', process.env.REDIS_URL);

    this.setupQueues();
  }

  private setupQueues() {
    // Email queue processor
    this.emailQueue.process(async (job) => {
      const { to, subject, template, data } = job.data;
      await this.sendEmail(to, subject, template, data);
    });

    // File processing queue processor
    this.fileQueue.process(async (job) => {
      const { fileId, operations } = job.data;
      await this.processFile(fileId, operations);
    });
  }

  async addEmailJob(emailData: EmailJobData): Promise<void> {
    await this.emailQueue.add(emailData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });
  }

  async addFileProcessingJob(fileData: FileJobData): Promise<void> {
    await this.fileQueue.add(fileData, {
      priority: 1,
      delay: 1000
    });
  }

  private async sendEmail(to: string, subject: string, template: string, data: any): Promise<void> {
    // Email sending logic
    console.log(`Sending email to ${to}: ${subject}`);
  }

  private async processFile(fileId: string, operations: string[]): Promise<void> {
    // File processing logic
    console.log(`Processing file ${fileId} with operations: ${operations.join(', ')}`);
  }
}
```

#### Scheduled Jobs

```typescript
// Cron jobs
import cron from 'node-cron';

export class ScheduledJobsService {
  constructor(private queueService: QueueService) {
    this.setupCronJobs();
  }

  private setupCronJobs() {
    // Daily cleanup job
    cron.schedule('0 2 * * *', async () => {
      console.log('Running daily cleanup job');
      await this.runDailyCleanup();
    });

    // Weekly report generation
    cron.schedule('0 9 * * 1', async () => {
      console.log('Running weekly report generation');
      await this.generateWeeklyReports();
    });

    // Monthly analytics
    cron.schedule('0 1 1 * *', async () => {
      console.log('Running monthly analytics');
      await this.runMonthlyAnalytics();
    });
  }

  private async runDailyCleanup(): Promise<void> {
    // Clean up old temporary files
    // Remove expired sessions
    // Archive old logs
  }

  private async generateWeeklyReports(): Promise<void> {
    // Generate project progress reports
    // Send summary emails to project owners
  }

  private async runMonthlyAnalytics(): Promise<void> {
    // Calculate monthly metrics
    // Generate analytics reports
    // Update dashboard data
  }
}
```

## API Rate Limiting

### Rate Limiting Implementation

```typescript
// Rate limiting middleware
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

export const createRateLimiter = (windowMs: number, maxRequests: number, message: string) => {
  return rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rl:'
    }),
    windowMs,
    max: maxRequests,
    message: {
      error: 'Too many requests',
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for admin users
      return req.user?.role === 'admin';
    }
  });
};

// API rate limiters
export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

export const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests, please try again later'
);

export const fileUploadLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // 10 uploads
  'Too many file uploads, please try again later'
);
```

#### Advanced Rate Limiting

```typescript
// Custom rate limiter with user-based limits
export class UserRateLimiter {
  private cache: CacheService;

  constructor(cache: CacheService) {
    this.cache = cache;
  }

  async checkLimit(userId: string, action: string, limit: number, windowMs: number): Promise<boolean> {
    const key = `rate_limit:${userId}:${action}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests in window
    const requests = await this.cache.get<number[]>(key) || [];

    // Filter out old requests
    const validRequests = requests.filter(timestamp => timestamp > windowStart);

    // Check if under limit
    if (validRequests.length >= limit) {
      return false;
    }

    // Add current request
    validRequests.push(now);

    // Store updated requests
    await this.cache.set(key, validRequests, Math.ceil(windowMs / 1000));

    return true;
  }

  async getRemainingRequests(userId: string, action: string, limit: number, windowMs: number): Promise<number> {
    const key = `rate_limit:${userId}:${action}`;
    const requests = await this.cache.get<number[]>(key) || [];
    const now = Date.now();
    const windowStart = now - windowMs;

    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    return Math.max(0, limit - validRequests.length);
  }
}
```

## Error Handling & Logging

### Global Error Handler

```typescript
// Global error handling middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error instanceof ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
  } else if (error instanceof AuthenticationError) {
    statusCode = 401;
    message = 'Authentication failed';
  } else if (error instanceof AuthorizationError) {
    statusCode = 403;
    message = 'Access denied';
  } else if (error instanceof NotFoundError) {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};
```

#### Structured Logging

```typescript
// Logger configuration
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
    log: (obj) => {
      if (obj.err) {
        // Handle error objects
        return {
          ...obj,
          err: {
            message: obj.err.message,
            stack: obj.err.stack,
            ...obj.err
          }
        };
      }
      return obj;
    }
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err
  },
  timestamp: pino.stdTimeFunctions.isoTime
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id,
      userAgent: req.get('User-Agent')
    });
  });

  next();
};
```

## Testing Strategy

### Unit Testing

```typescript
// User service unit tests
import { UserService } from '../services/UserService';
import { mockPrisma } from '../../test/mocks/prisma';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockPrisma);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      mockPrisma.user.create.mockResolvedValue({
        id: '123',
        ...userData,
        passwordHash: 'hashed_password',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await userService.createUser(userData);

      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: userData.name,
          email: userData.email
        })
      });
    });

    it('should throw error for duplicate email', async () => {
      mockPrisma.user.create.mockRejectedValue(
        new Error('Unique constraint violation')
      );

      await expect(userService.createUser({
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123'
      })).rejects.toThrow();
    });
  });
});
```

### Integration Testing

```typescript
// API integration tests
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../lib/prisma';

describe('User API', () => {
  beforeEach(async () => {
    // Clean up database
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: userData.name,
        email: userData.email
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('should return validation error for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('validation');
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by id', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          passwordHash: 'hashed'
        }
      });

      const response = await request(app)
        .get(`/api/v1/users/${user.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(user.id);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/v1/users/non-existent-id')
        .expect(404);
    });
  });
});
```

### End-to-End Testing

```typescript
// E2E tests with database
import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';

test.describe('User Management', () => {
  test.beforeEach(async () => {
    // Clean database
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
  });

  test('user can register and create project', async ({ page }) => {
    // Navigate to registration
    await page.goto('/register');

    // Fill registration form
    await page.fill('[name="name"]', 'John Doe');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Create a new project
    await page.click('[data-testid="create-project"]');
    await page.fill('[name="projectName"]', 'My Test Project');
    await page.fill('[name="description"]', 'A test project');
    await page.click('[data-testid="submit-project"]');

    // Should see project in list
    await expect(page.locator('text=My Test Project')).toBeVisible();
  });

  test('user cannot access other user projects', async ({ page, context }) => {
    // Create two users and projects
    const user1 = await prisma.user.create({
      data: { name: 'User 1', email: 'user1@test.com', passwordHash: 'hash1' }
    });
    const user2 = await prisma.user.create({
      data: { name: 'User 2', email: 'user2@test.com', passwordHash: 'hash2' }
    });

    const project1 = await prisma.project.create({
      data: { name: 'Project 1', ownerId: user1.id }
    });
    const project2 = await prisma.project.create({
      data: { name: 'Project 2', ownerId: user2.id }
    });

    // Login as user1
    await page.goto('/login');
    await page.fill('[name="email"]', 'user1@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[type="submit"]');

    // Should see project1 but not project2
    await expect(page.locator(`text=${project1.name}`)).toBeVisible();
    await expect(page.locator(`text=${project2.name}`)).toBeHidden();
  });
});
```

This backend architecture provides a solid foundation for scalable, secure, and maintainable API services that power the Monynha Softwares platform.