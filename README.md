# Team Task Manager

A full-stack web application for project and task management with role-based access control.

## Features

- **Modern UI** with sidebar navigation and responsive design
- **Dashboard** with real-time statistics
- **Project Management** - Create projects and manage team members
- **Task Management** - Create, assign, and track tasks with status, priority, and due dates
- **Team Management** - Search and add members to projects
- **Role-Based Access** - Admin/Member roles with appropriate permissions
- **Search & Filters** - Find tasks by project, status, or search term

## Tech Stack

- **Frontend**: React, styled-components, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Railway

## Color Palette

- Primary: `#093c5d` (Dark Navy)
- Secondary: `#3b7597` (Steel Blue)
- Accent: `#6fd1da` (Light Cyan)
- Success: `#75df8d` (Mint Green)

## Local Development

```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

## Deployment to Railway (Step-by-Step Guide)

### Step 1: Push Code to GitHub

```bash
# Navigate to project directory
cd team-task-manager

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create main branch
git branch -M main

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git

# Push to GitHub
git push -u origin main
```

### Step 2: Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account → Build a Database
3. Choose **Free Tier** → Select region (e.g., Singapore)
4. Create Cluster (wait 1-2 minutes)
5. Click **Connect** → **Connect your application**
6. Copy the connection string
7. Replace `<password>` with your database user password

### Step 3: Deploy Backend on Railway

1. Go to [Railway.app](https://railway.app) and sign up/login
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `team-task-manager` repository
4. Railway will detect Node.js - select **Backend** folder or configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Go to **Settings** → **Environment Variables** and add:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any random string (e.g., `mysecretkey123`)
6. Railway will provide a URL like `https://team-task-manager-backend.up.railway.app`
7. Copy this URL (without https://) - this is your **API_URL**

### Step 4: Deploy Frontend on Railway

1. In Railway, click **New Project** → **Deploy from GitHub repo**
2. Select your repository
3. Configure the frontend:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s build -l 3000`
4. Go to **Settings** → **Environment Variables** and add:
   - `REACT_APP_API_URL` = `https://YOUR-BACKEND-URL.railway.app`
5. Wait for build to complete

### Step 5: Final Configuration

1. In **Backend** Railway settings, add:
   - `FRONTEND_URL` = `https://YOUR-FRONTEND-URL.railway.app`
2. Your app is now live!

### Alternative: Deploy Backend First, Then Frontend

If you prefer to deploy frontend separately or use a different hosting:

1. Deploy backend as described in Step 3
2. Get the backend URL
3. In frontend `src/context/AuthContext.js`, set the API_URL:
   ```javascript
   const API_URL = 'https://your-backend-url.railway.app';
   ```
4. Build the React app: `npm run build`
5. Deploy the `build` folder to any static hosting (Netlify, Vercel, Railway Static)

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teamtaskmanager
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-frontend-url.railway.app
```

### Frontend
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## Test Accounts

Create these accounts after deploying:

### Admin
- Email: admin@test.com
- Password: admin123
- Role: Admin

### Member
- Email: john@test.com
- Password: john123
- Role: Member

## Demo Video Script (2-5 minutes)

### Scene 1: Introduction (20s)
"Welcome to Team Task Manager - a full-stack web application for managing projects and tasks with your team."

### Scene 2: Authentication (30s)
- Show login page
- Login with admin account
- Explain role-based access

### Scene 3: Dashboard (45s)
- Overview of statistics (Projects, To Do, In Progress, Overdue)
- Recent projects card
- Create new project button

### Scene 4: Project Management (60s)
- Click on a project
- Show members list
- Add new member by email
- Show project tasks

### Scene 5: Task Management (60s)
- Create task with title and description
- Assign to team member
- Set priority (High/Medium/Low)
- Set due date
- Update status: To Do → In Progress → Done

### Scene 6: Team Page (30s)
- Show all team members
- Search users
- Add to project

### Scene 7: Wrap-up (15s)
"Thank you for watching! The app is now live and ready to use."

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/members` - Add member

### Tasks
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users/search?q=email` - Search users
- `POST /api/users/add-to-project` - Add to project

## License

MIT License
