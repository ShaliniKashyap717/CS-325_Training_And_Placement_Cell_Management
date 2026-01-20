# Training and Placement Cell Management System  
DBMS Semester Project – Planning & Requirement Analysis

---

## Project Overview

The **Training and Placement Cell Management System** is a proposed database-driven system intended to manage and organize the activities of a college Training and Placement Cell.  
This document represents the **planning and requirement analysis phase** of the project and focuses on identifying the data requirements, entities, relationships, and database design considerations before implementation.

---

## Objective

- To analyze the requirements of a Training and Placement Cell
- To identify entities, attributes, and relationships involved in the system
- To design an initial conceptual database model
- To prepare a strong foundation for ER diagram creation and database implementation

---

## Scope of the System

The proposed system will support:
- Management of student academic and placement-related data
- Management of company and job profile details
- Tracking of student job applications and placement status
- Management of training programs conducted by the placement cell
- Generation of placement and training-related reports

---

## Functional Requirements

- Store student personal and academic information
- Store company and job profile information
- Track student applications for job profiles
- Maintain records of training programs and student enrollments
- Allow retrieval of placement statistics for analysis

---

## Non-Functional Requirements

- Data consistency and integrity
- Minimal data redundancy through normalization
- Scalability to support multiple batches and companies
- Secure handling of student and company data

---

## Identified Entities and Attributes

### Student
- StudentID (Primary Key)
- Name
- RollNumber
- Branch
- Year
- CGPA
- Email
- PhoneNumber
- ResumeLink

---

### Company
- CompanyID (Primary Key)
- CompanyName
- Location
- IndustryType
- HRName
- HRContact

---

### JobProfile
- JobID (Primary Key)
- CompanyID (Foreign Key)
- Role
- Package
- JobType
- EligibilityCGPA

---

### Application
- ApplicationID (Primary Key)
- StudentID (Foreign Key)
- JobID (Foreign Key)
- ApplicationDate
- ApplicationStatus

---

### TrainingProgram
- TrainingID (Primary Key)
- Title
- TrainerName
- StartDate
- EndDate
- Description

---

### TrainingEnrollment
- EnrollmentID (Primary Key)
- StudentID (Foreign Key)
- TrainingID (Foreign Key)
- AttendancePercentage
- CompletionStatus

---

## Identified Relationships

- A **Student** can apply for multiple **JobProfiles**
- A **JobProfile** can receive applications from multiple **Students**
- A **Company** can offer multiple **JobProfiles**
- A **Student** can enroll in multiple **TrainingPrograms**
- A **TrainingProgram** can have multiple enrolled **Students**
- The many-to-many relationship between Student and TrainingProgram is resolved using the **TrainingEnrollment** entity

---

## Conceptual ER Model (Planned)

- Entities: Student, Company, JobProfile, Application, TrainingProgram, TrainingEnrollment
- Relationships:
  - Company offers JobProfile (One-to-Many)
  - Student applies for JobProfile (Many-to-Many via Application)
  - Student enrolls in TrainingProgram (Many-to-Many via TrainingEnrollment)

The ER diagram will be designed in the next phase of the project.

---

## Database Design Considerations

- Each entity will be mapped to a separate table
- Primary and foreign keys will enforce referential integrity
- The database will be normalized up to Third Normal Form (3NF)
- Associative entities will be used to resolve many-to-many relationships

---

## Assumptions

- Each student is uniquely identified by StudentID
- A student can apply to multiple job profiles
- A company can offer more than one job profile
- Training programs can have multiple participants
- Placement status is tracked per application

---

## Deliverables of This Phase

- Requirement analysis document
- List of entities and attributes
- Identification of relationships
- Conceptual design plan for ER diagram

---

## Conclusion

This document outlines the planning and requirement analysis for the Training and Placement Cell Management System.  
It serves as the foundation for subsequent phases including ER diagram creation, relational schema design, normalization, SQL implementation, and report generation.

## Developed By:
Shagun Rana (23BCS105)
Shalini Kashyap (23BCS106)
Shanpreet Singh (23BCS107)
Shivansh Chadda (23BCS108)