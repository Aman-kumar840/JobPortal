# JobRecommender (PERN Stack) 🚀

A production-ready Job Portal built using the **PERN Stack (PostgreSQL, Express.js, React.js, Node.js)**. The platform enables Recruiters and Applicants to interact through a secure role-based ecosystem featuring intelligent application tracking, dynamic job filtering, secure resume management, and JWT-protected APIs.

Designed with a strong focus on **backend engineering, database design, authentication, security, and scalable architecture**, this project demonstrates real-world full-stack development practices commonly used in modern recruitment platforms.

---

## 🌟 Features

### 👨‍💼 Applicant Features

- Search jobs using keyword, location, and employment type filters.
- Upload PDF resumes securely during application.
- Smart application buttons that dynamically display:
  - Apply
  - Already Applied
  - Re-Apply
- Track application status:
  - Pending
  - Accepted
  - Rejected
  - Withdrawn
- Withdraw applications without losing historical records.

### 🏢 Recruiter Features

- Dedicated recruiter dashboard.
- Create, update, view, and delete job postings.
- View all applicants for a job posting.
- Download submitted resumes.
- Update applicant status in real-time.

### 🔒 Security Features

- JWT-based authentication.
- Role-based authorization.
- Password hashing using bcrypt.
- Protected backend routes.
- PDF-only resume uploads.
- File-size restrictions.
- Parameterized SQL queries to prevent SQL injection.
- Automatic JWT attachment through Axios interceptors.

---

## 🏗️ System Architecture

```text
┌─────────────────────────┐
│ React.js + Bootstrap 5  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Axios + JWT Interceptor │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Express REST APIs      │
└───────┬─────────┬───────┘
        │         │
        ▼         ▼
┌────────────┐ ┌──────────────┐
│ PostgreSQL │ │ Multer Upload│
│ Database   │ │ Middleware   │
└────────────┘ └──────────────┘
```

---

## 🔥 Engineering Highlights

### Stateless Authentication

Implemented JWT-based authentication with reusable middleware for secure route protection and role-based authorization.

### Relational Database Design

Designed a normalized PostgreSQL schema utilizing:

- Foreign Key Constraints
- Cascading Deletes
- Relational Joins

to maintain data consistency and prevent orphaned records.

### Dynamic Job Filtering

Built flexible SQL query construction supporting:

- Keyword Search
- Location Filtering
- Employment Type Filtering

without requiring multiple endpoints.

### Context-Aware UI

Developed smart frontend logic that calculates application state in real-time by comparing user history against current job records.

### Soft Withdraw Functionality

Instead of deleting records permanently, application status is updated to **Withdrawn**, preserving historical data for recruiters and analytics.

### Duplicate Application Prevention

Implemented backend validation to prevent users from submitting multiple active applications to the same job posting.

---

## 🗄️ Database Relationships

```text
[ Recruiter ]
      │
      └──── creates ────► [ Jobs ]
                               │
                               │
                               ▼
                        [ Applications ]
                               ▲
                               │
                               │
[ Applicant ] ───── applies ───┘
```

---

## 📊 API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate and issue JWT |
| GET | `/api/auth/me` | Retrieve authenticated user |

### Jobs

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/jobs` | Retrieve all jobs |
| GET | `/api/jobs/:id` | Retrieve job details |
| GET | `/api/jobs/my` | Recruiter's jobs |
| POST | `/api/jobs` | Create job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Applications

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/jobs/:jobId/apply` | Apply to job |
| GET | `/api/applications/my` | Applicant history |
| GET | `/api/applications/job/:id` | View applicants |
| PATCH | `/api/applications/:id/status` | Update status |
| DELETE | `/api/applications/:id` | Withdraw application |

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Hooks
- Context API
- React Router DOM v6
- Axios
- Bootstrap 5

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Multer

### Database

- PostgreSQL
- pg Connection Pool

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Database Setup

```sql
CREATE DATABASE job_portal;
```

Run the schema below:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20)
        CHECK (role IN ('applicant', 'recruiter')),
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    recruiter_id INT REFERENCES users(id)
        ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    salary_min INT,
    salary_max INT,
    job_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id)
        ON DELETE CASCADE,
    applicant_id INT REFERENCES users(id)
        ON DELETE CASCADE,
    resume_url TEXT,
    status VARCHAR(20)
        DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'accepted',
                'rejected',
                'withdrawn'
            )
        ),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=8000
DATABASE_URL=postgresql://jobadmin:secret@localhost:5434/job_portal
JWT_SECRET=your_super_secret_key
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 📁 Project Structure

```text
job-recommender/
│
├── client/
│   ├── src/
│   ├── public/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
├── README.md
└── package.json
```

---

## 📸 Screenshots

## 📸 Screenshots

### Applicant Dashboard
<img src="assets/applicant-dashboard.png" width="800" alt="Applicant Dashboard View">

### Recruiter View
<img src="assets/recruiter-view.png" width="800" alt="Recruiter Dashboard View">

### Application Tracking
<img src="assets/application-tracking.png" width="800" alt="My Applications Table">
---

## 🚀 Future Enhancements

- AWS S3 Integration
- Redis Caching
- Docker Containerization
- GitHub Actions CI/CD
- Resume Parsing
- Skill Extraction
- AI-Powered Job Recommendations
- Semantic Search with Vector Embeddings
- Elasticsearch Integration

---

## 👨‍💻 Author

### Aman Kumar

Software Engineer

Focused on:

- Backend Engineering
- Distributed Systems
- Applied Machine Learning
- Full-Stack Development
- Scalable System Design

### Connect With Me

- GitHub: https://github.com/Aman-kumar840
- LinkedIn: https://www.linkedin.com/in/aman-kumar-016927308/

---

⭐ If you found this project useful, consider giving it a star on GitHub.