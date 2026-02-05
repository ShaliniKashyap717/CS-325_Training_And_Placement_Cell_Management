# Training and Placement Cell Management System  
**DBMS Semester Project – Planning & Requirement Analysis**

---
## Project Overview

The Training and Placement Cell Management System is a proposed database-driven system intended to manage and organize the activities of a college Training and Placement Cell.  
This document represents the planning and requirement analysis phase of the project and focuses on identifying the data requirements, entities, relationships, and database design considerations before implementation.

---

## Scope of the System

The proposed system will support:
- Management of student academic and placement-related data  
- Management of company and job profile details  
- Tracking of student job applications and placement status  
- Management of training programs conducted by the placement cell  
- Generation of placement and training-related reports  

---
## Objective

- To analyze the requirements of a Training and Placement Cell  
- To identify entities, attributes, and relationships involved in the system  
- To design an initial conceptual database model  
- To prepare a strong foundation for ER diagram creation and database implementation  
---

## Sources of Requirement Gathering

- Observation of real-world Training and Placement Cell processes  
- Discussions with seniors, placement coordinators, and faculty members  
- Analysis of existing placement records such as student lists, company details, and job offers  
- Study of similar Training and Placement Management Systems available online  
- Understanding academic DBMS laboratory and semester project requirements  

---
## Functional Requirements

- Store student personal, academic, and placement-related information  
- Ensure each student is uniquely identified using StudentID, Roll Number, and Email  
- Store company information including HR contact details  
- Allow companies to offer multiple job profiles  
- Define job profile details such as role, package, job type, and eligibility criteria  
- Enable students to apply for multiple job profiles  
- Prevent a student from applying to the same job profile more than once  
- Track application status such as Applied, Shortlisted, Selected, and Rejected  
- Maintain records of training programs conducted by the placement cell  
- Allow students to enroll in multiple training programs  
- Store attendance and completion status for training programs  
- Allow retrieval of placement statistics and training data for analysis and reporting  
---

## Identified Entities and Attributes

### Student
- StudentID (Primary Key)  
- Name  
- RollNumber
- Branch
- Active Backlogs
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

- A **Company** can offer multiple **JobProfiles** (One-to-Many)  
- A **Student** can apply for multiple **JobProfiles** (Many-to-Many)  
- A **JobProfile** can receive applications from multiple **Students**  
- The many-to-many relationship between **Student** and **JobProfile** is resolved using the **Application** entity  
- A **Student** can enroll in multiple **TrainingPrograms** (Many-to-Many)  
- A **TrainingProgram** can have multiple enrolled **Students**  
- The many-to-many relationship between **Student** and **TrainingProgram** is resolved using the **TrainingEnrollment** entity  

---

## Conceptual ER Model (Planned)

- **Entities**: Student, Company, JobProfile, Application, TrainingProgram, TrainingEnrollment  

- **Relationships**:
  - Company offers JobProfile (One-to-Many)  
  - Student applies for JobProfile (Many-to-Many via Application)  
  - Student enrolls in TrainingProgram (Many-to-Many via TrainingEnrollment)  

The ER diagram will be designed in the next phase of the project.

---

## Database Design Considerations

- Each entity will be mapped to a separate table  
- Primary keys will uniquely identify records  
- Foreign keys will enforce referential integrity  
- Associative entities will be used to resolve many-to-many relationships  
- Constraints will be applied to maintain data validity  
- The database schema will follow DBMS best practices  

---
## Assumptions

- Each student is uniquely identified by StudentID  
- A student can apply to multiple job profiles but only once per job profile  
- A company can offer more than one job profile  
- Training programs can have multiple participants  
- Placement status is tracked individually for each application  
---

## Deliverables of This Phase

- Requirement analysis document  
- List of entities and their attributes  
- Identification of relationships between entities  
- Conceptual design plan for ER diagram creation  

---

## Conclusion

This document presents a comprehensive overview of the planning and requirement analysis for the Training and Placement Cell Management System. It clearly defines the system objectives, functional requirements, and overall scope, establishing a strong foundation for the development process.

The analysis carried out in this phase supports the upcoming stages of the project, including ER diagram design, relational schema formulation, database normalization, SQL implementation, and report generation. Together, these phases will ensure the system is well-structured, efficient, and capable of effectively managing training and placement activities.

---

## Developed By

- **Shagun Rana** (23BCS105)  
- **Shalini Kashyap** (23BCS106)  
- **Shanpreet Singh** (23BCS107)  
- **Shivansh Chadda** (23BCS108)  
