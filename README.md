# KPS | Timetable Management System

Official academic scheduling platform for **Kabale Preparatory School (KPS)**. Designed for "Excellence in Organization," this system streamlines the management of pupils, faculty, lessons, and classrooms.

## 🚀 Features

- **Automated Timetable Generation**: A core orchestration engine to automatically generate collision-free schedules for the entire school.
- **Management Console**: Comprehensive control for Administrators to manage the school's ecosystem.
- **Faculty Management**: Registration and organization of Primary and Nursery teaching staff.
- **Pupil Admission**: Streamlined tracking of enrolled pupils across different sections.
- **Subject Repository**: Centralized database for academic lessons and curriculum planning.
- **Classroom & Infrastructure**: Management of physical rooms and academic sections.
- **Dashboard & Analytics**: Real-time stats on enrolled pupils, active lessons, and teaching staff.
- **Notification System**: Keeping the school community updated on schedule changes.

## 🛠️ Tech Stack

- **Frontend**: Vite, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Backend/Database**: Supabase (PostgreSQL, Auth, RLS)
- **Icons**: Lucide React
- **Authentication**: Custom AuthProvider with role-based access control (Admin, Head Teacher, Teacher, Pupil).

## 📥 Getting Started

### Prerequisites

- Node.js & npm installed.
- A Supabase project set up.

### Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/grace1akansasira-design/KPS-SYSTEM.git
   cd KPS-SYSTEM
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```sh
   npm run dev
   ```

## 📜 Database Setup

The project includes several SQL scripts and CJS utilities in the root directory for database management and RLS policy fixes. Specifically:
- `fix_database.sql`: Initial schema setup.
- `master_fix_and_restore.sql`: Comprehensive fix and data restoration script.

## 🌐 Deployment

The project is optimized for deployment via Lovable or any modern frontend hosting provider (Vercel, Netlify).

---
© 2027 Kabale Preparatory School. All rights reserved.
