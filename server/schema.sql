CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('applicant','recruiter')) NOT NULL,
  skills TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  recruiter_id INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  salary_min INT, 
  salary_max INT,
  job_type VARCHAR(30) CHECK (job_type IN ('full-time','part-time','internship','contract')),
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id INT REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status VARCHAR(20) DEFAULT 'applied',
  applied_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);
