# Agentic Run Tracker

> A full-stack web application for tracking and managing AI agent runs, projects, and datasets with a modern, responsive UI and MySQL backend.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.8-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

Agentic Run Tracker is a comprehensive database management system designed for tracking AI agent runs, experiments, and related metadata. It features:

- **MySQL Backend**: Robust relational database with stored procedures, triggers, and functions
- **RESTful API**: Express.js backend with full CRUD operations
- **Modern UI**: Next.js 14 frontend with Tailwind CSS v4
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: React Query for efficient data fetching and caching

## ✨ Features

### Frontend

- 📊 **Dashboard**: Overview with statistics and quick access to tables
- 🗃️ **Database Browser**: Browse all MySQL tables with a beautiful card-based UI
- ✏️ **CRUD Operations**: Create, Read, Update, and Delete records on any table
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Built with Tailwind CSS v4, featuring smooth animations and gradients
- 🔍 **Pagination**: Navigate through large datasets efficiently
- 🍞 **Toast Notifications**: Real-time feedback for all operations
- 🎭 **Modals**: Clean, accessible forms for creating and editing records

### Backend

- 🔌 **RESTful API**: Full CRUD endpoints for dynamic table access
- 🔒 **SQL Injection Protection**: Validated table names against schema
- 🗄️ **MySQL Integration**: Direct connection to MySQL database
- 📦 **Prisma ORM**: Type-safe database access (optional)
- 🔄 **CORS Support**: Configurable cross-origin resource sharing

### Database

- 📋 **9 Core Tables**: agent, artifact, dataset, environment, project, run, runmetric, runstep, user
- 🔧 **Stored Procedures**: Pre-built functions for complex operations
- ⚡ **Triggers**: Automatic timestamp and data validation
- 🌱 **Seed Data**: Example data to get started quickly

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack React Query (React Query v5)
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Language**: TypeScript

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Database**: MySQL 8.0+
- **Language**: TypeScript
- **Middleware**: CORS, Body-parser

### Development Tools

- **Testing**: Vitest
- **Build Tool**: Next.js built-in compiler
- **Package Manager**: npm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

Check your installations:

```bash
node --version
python --version
mysql --version
```

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/srinix18/Agentic-run-tracker.git
cd Agentic-run-tracker
```

### 2. Database Setup

#### Create MySQL Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE agentic_tracker;
USE agentic_tracker;
```

#### Configure Database Connection

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your MySQL credentials
# Example:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agentic_tracker
```

#### Apply Schema and Seed Data

```bash
# (Optional) Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
.\venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Apply schema and seed data
python run_sql.py --apply
```

This will create all tables, stored procedures, triggers, and insert sample data (10 users, 10 projects, 10 agents, 10 runs).

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install

# Configure Prisma (optional)
npx prisma generate

# Start the backend server
npm run dev
```

Backend will run on **http://localhost:4000**

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on **http://localhost:3000**

## ⚙️ Configuration

### Environment Variables

#### Backend (`.env` in root directory)

```env
# MySQL Connection
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agentic_tracker

# Prisma Database URL
DATABASE_URL="mysql://root:your_password@localhost:3306/agentic_tracker"

# Server Port (optional)
PORT=4000
```

#### Frontend (`.env.local` in `frontend/` directory)

```env
# API Base URL (optional - defaults to http://localhost:4000)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Port Configuration

Default ports:

- **Frontend**: 3000
- **Backend**: 4000
- **MySQL**: 3306

To change ports:

- **Frontend**: Edit `package.json` → `"dev": "next dev -p 3000"`
- **Backend**: Set `PORT` in `.env` or edit `backend/src/index.ts`

## 🚀 Running the Application

### Quick Start (All Services)

#### Windows PowerShell:

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### macOS/Linux:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/api/meta/tables

### Verify Installation

```bash
# Check backend is running
curl http://localhost:4000/api/meta/tables

# Expected output:
{"tables":["agent","artifact","dataset","environment","project","run","runmetric","runstep","user"]}
```

## 📖 Usage Guide

### Dashboard

1. **Navigate to http://localhost:3000**
2. You'll see the dashboard with:
   - Statistics cards showing total tables, active runs, and projects
   - Grid of available database tables
   - Quick action buttons

### Browse Tables

1. **From Dashboard**: Click on any table card
2. **From Menu**:
   - Click hamburger menu (mobile) or use sidebar (desktop)
   - Click "Tables" → Browse all tables

### View Table Data

1. Click on a table name (e.g., "agent", "project")
2. See all records in a responsive table view
3. Use pagination to navigate through records

### Create New Record

1. Navigate to any table detail page
2. Click **"+ New Record"** button (green button, top-right)
3. Fill in the form fields in the modal
4. Click **"Save Changes"**
5. Success toast notification will appear

### Edit Record

1. Find the record in the table
2. Click the **"Edit"** button on that row
3. Modify values in the modal
4. Click **"Save Changes"**
5. Changes are saved and table refreshes

### Delete Record

1. Find the record in the table
2. Click the **"Delete"** button on that row
3. Confirm deletion in the dialog
4. Click **"Delete"** to confirm
5. Record is removed and table refreshes

### Navigation

#### Desktop

- Sidebar is always visible on the left
- Click "Dashboard", "Tables", or "Settings" to navigate

#### Mobile

- Tap hamburger menu icon (top-left)
- Sidebar slides in from left
- Tap any link to navigate
- Sidebar auto-closes after selection

### Responsive Features

- **Mobile**: Horizontal scrolling for tables, stacked layouts
- **Tablet**: 2-column grids, optimized spacing
- **Desktop**: 3-4 column grids, full sidebar

## 📁 Project Structure

```
agentic-run-tracker/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── index.ts           # Main server file with API routes
│   │   ├── db.ts              # Prisma client configuration
│   │   └── types.d.ts         # TypeScript type definitions
│   ├── prisma/
│   │   └── schema.prisma      # Prisma schema (optional)
│   ├── tests/                 # Backend tests
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js 14 frontend
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Dashboard page
│   │   ├── globals.css        # Global styles (Tailwind)
│   │   ├── _dashboard/
│   │   │   └── DashboardContent.tsx
│   │   └── tables/
│   │       ├── page.tsx       # Tables listing
│   │       └── [table]/
│   │           └── page.tsx   # Table detail with CRUD
│   ├── components/            # React components
│   │   ├── ClientShell.tsx    # Navigation shell with mobile menu
│   │   ├── Sidebar.tsx        # Sidebar navigation
│   │   ├── Topbar.tsx         # Top bar
│   │   ├── TableView.tsx      # Data table component
│   │   ├── RecordModal.tsx    # Create/Edit modal
│   │   ├── ConfirmDialog.tsx  # Delete confirmation
│   │   └── DashboardClient.tsx
│   ├── hooks/
│   │   └── useTable.tsx       # Custom hook for table operations
│   ├── lib/
│   │   └── api.ts             # API client (Axios)
│   ├── tests/                 # Frontend tests
│   ├── package.json
│   ├── tailwind.config.js     # Tailwind configuration
│   └── next.config.js         # Next.js configuration
│
├── schema.sql                  # MySQL schema with seed data
├── run_sql.py                 # Schema application script
├── run_queries.sql            # Example SQL queries
├── requirements.txt           # Python dependencies
├── .env.example              # Environment template
├── .gitignore
└── README.md
```

## 🔌 API Documentation

### Base URL

```
http://localhost:4000/api
```

### Endpoints

#### Get All Tables

```http
GET /api/meta/tables
```

**Response:**

```json
{
  "tables": [
    "agent",
    "artifact",
    "dataset",
    "environment",
    "project",
    "run",
    "runmetric",
    "runstep",
    "user"
  ]
}
```

#### Get Table Records

```http
GET /api/:table?page=1&limit=20
```

**Parameters:**

- `table` (path): Table name
- `page` (query): Page number (default: 1)
- `limit` (query): Records per page (default: 20)

**Response:**

```json
{
  "data": [...],
  "page": 1,
  "limit": 20
}
```

#### Get Single Record

```http
GET /api/:table/:id
```

**Response:**

```json
{
  "id": 1,
  "name": "Example",
  ...
}
```

#### Create Record

```http
POST /api/:table
Content-Type: application/json

{
  "name": "New Record",
  "description": "Description",
  ...
}
```

#### Update Record

```http
PUT /api/:table/:id
Content-Type: application/json

{
  "name": "Updated Record",
  ...
}
```

#### Delete Record

```http
DELETE /api/:table/:id
```

### Error Responses

```json
{
  "error": "Error message"
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**

```powershell
# Windows - Find and kill process on port 3000/4000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Or use different ports:

```bash
# Frontend
npm run dev -- -p 3002

# Backend - change PORT in .env
PORT=4001
```

#### 2. Database Connection Failed

**Error:** `ECONNREFUSED` or `Access denied`

**Solution:**

- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `.env`
- Ensure database exists: `CREATE DATABASE agentic_tracker;`
- Check `DATABASE_URL` format in `.env`

#### 3. Tailwind CSS Not Working

**Error:** Unstyled page, Times New Roman font

**Solution:**

```bash
cd frontend
# Clear Next.js cache
rm -rf .next
# Restart dev server
npm run dev
# Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

#### 4. QueryClient Error

**Error:** `No QueryClient set`

**Solution:** Already fixed in code. If you see this, ensure you're using the latest version from this repo.

#### 5. Module Not Found

**Error:** `Cannot find module`

**Solution:**

```bash
# Reinstall dependencies
cd frontend  # or backend
rm -rf node_modules package-lock.json
npm install
```

#### 6. Python Script Fails

**Error:** Schema application fails

**Solution:**

```bash
# Ensure Python dependencies are installed
pip install -r requirements.txt

# Check MySQL credentials in .env
# Verify MySQL is running and accessible

# Run with verbose output
python run_sql.py --apply --verbose
```

### Debug Mode

#### Frontend Debug

```bash
# Check Next.js build
cd frontend
npm run build

# Check for errors in browser console (F12)
```

#### Backend Debug

```bash
# Check backend logs in terminal
# Test API manually
curl http://localhost:4000/api/meta/tables
```

#### Database Debug

```sql
-- Check tables exist
SHOW TABLES;

-- Check data
SELECT * FROM user LIMIT 5;
SELECT * FROM project LIMIT 5;
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Run All Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## 📝 Development Notes

### Database Schema

- **Idempotent**: Running `python run_sql.py --apply` multiple times is safe
- **Seed Data**: 10 records each for users, projects, agents, and runs
- **Stored Procedures**: Pre-built for complex operations
- **Triggers**: Automatic timestamp updates

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting configured
- **Prettier**: Code formatting (configure as needed)

### Tailwind CSS v4

- Uses new `@import "tailwindcss"` syntax
- PostCSS plugin: `@tailwindcss/postcss`
- No `@tailwind` directives needed

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Prisma for the excellent ORM
- TanStack Query for data fetching
- All open-source contributors

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing GitHub issues
3. Create a new issue with detailed description and logs

## 🎯 Roadmap

- [ ] User authentication and authorization
- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and search
- [ ] Data visualization charts
- [ ] Export data to CSV/JSON
- [ ] Batch operations
- [ ] API rate limiting
- [ ] Docker containerization

---

**Built with ❤️ using Next.js, Express, and MySQL**
