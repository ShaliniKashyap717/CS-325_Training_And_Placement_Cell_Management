/*
  # Training and Placement Cell Management System - Database Schema

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `roll_number` (text, unique)
      - `branch` (text)
      - `year` (integer)
      - `cgpa` (decimal)
      - `email` (text, unique)
      - `phone_number` (text)
      - `resume_link` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `companies`
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `location` (text)
      - `industry_type` (text)
      - `hr_name` (text)
      - `hr_contact` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `job_profiles`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key)
      - `role` (text)
      - `package` (decimal)
      - `job_type` (text)
      - `eligibility_cgpa` (decimal)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `applications`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `job_id` (uuid, foreign key)
      - `application_date` (timestamptz)
      - `application_status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `training_programs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `trainer_name` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `training_enrollments`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `training_id` (uuid, foreign key)
      - `attendance_percentage` (decimal)
      - `completion_status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (for demonstration purposes)
    
  3. Indexes
    - Add indexes on foreign keys for better query performance
    - Add indexes on frequently queried fields
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  roll_number text UNIQUE NOT NULL,
  branch text NOT NULL,
  year integer NOT NULL CHECK (year >= 1 AND year <= 4),
  cgpa decimal(3,2) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
  email text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  resume_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  location text NOT NULL,
  industry_type text NOT NULL,
  hr_name text NOT NULL,
  hr_contact text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_profiles table
CREATE TABLE IF NOT EXISTS job_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role text NOT NULL,
  package decimal(10,2) NOT NULL,
  job_type text NOT NULL,
  eligibility_cgpa decimal(3,2) NOT NULL CHECK (eligibility_cgpa >= 0 AND eligibility_cgpa <= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES job_profiles(id) ON DELETE CASCADE,
  application_date timestamptz DEFAULT now(),
  application_status text DEFAULT 'Applied' CHECK (application_status IN ('Applied', 'Shortlisted', 'Rejected', 'Selected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, job_id)
);

-- Create training_programs table
CREATE TABLE IF NOT EXISTS training_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  trainer_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (end_date >= start_date)
);

-- Create training_enrollments table
CREATE TABLE IF NOT EXISTS training_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  training_id uuid NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
  attendance_percentage decimal(5,2) DEFAULT 0 CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
  completion_status text DEFAULT 'Enrolled' CHECK (completion_status IN ('Enrolled', 'Completed', 'Dropped')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, training_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_job_profiles_company_id ON job_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(application_status);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_student_id ON training_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_training_id ON training_enrollments(training_id);
CREATE INDEX IF NOT EXISTS idx_students_cgpa ON students(cgpa);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demonstration purposes)
-- In production, you would want more restrictive policies

CREATE POLICY "Allow public read access on students"
  ON students FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on students"
  ON students FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on students"
  ON students FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on students"
  ON students FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on companies"
  ON companies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on companies"
  ON companies FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on companies"
  ON companies FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on companies"
  ON companies FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on job_profiles"
  ON job_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on job_profiles"
  ON job_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on job_profiles"
  ON job_profiles FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on job_profiles"
  ON job_profiles FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on applications"
  ON applications FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on applications"
  ON applications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on applications"
  ON applications FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on applications"
  ON applications FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on training_programs"
  ON training_programs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on training_programs"
  ON training_programs FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on training_programs"
  ON training_programs FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on training_programs"
  ON training_programs FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on training_enrollments"
  ON training_enrollments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on training_enrollments"
  ON training_enrollments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on training_enrollments"
  ON training_enrollments FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete on training_enrollments"
  ON training_enrollments FOR DELETE
  TO public
  USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_profiles_updated_at BEFORE UPDATE ON job_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON training_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_enrollments_updated_at BEFORE UPDATE ON training_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();