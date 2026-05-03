Based sa client response, ito yung **MVP system architecture** na bagay sa app nila. Ang core direction is a **web-based Labor Productivity and Construction Progress Monitoring System** for **Supervisor / Site Engineer / QA-QC**, where progress is computed using actual completed area, target area, schedule, and manpower productivity standards.

---

# MVP System Architecture

## 1. High-Level Architecture

```text
User: Supervisor / Site Engineer / QA-QC
        |
        v
Responsive Web App
        |
        v
Frontend UI Layer
Dashboard | Projects | Task Heads | Specific Tasks | Calendar | Reports
        |
        v
Backend API Layer
Auth | Project Management | Task Management | Progress Tracking | Productivity Computation | Reports
        |
        v
Database Layer
Users | Projects | Task Heads | Tasks | Progress Updates | Worker Standards | Reports
```

## 2. Main System Modules

### A. Authentication Module

This is for login and access control.

**MVP users:**

- Admin
- Supervisor / Site Engineer / QA-QC

For MVP, kahit simple login muna. The main purpose is to make sure only authorized users can create projects, update progress, and view reports.

---

### B. Project Management Module

This is where the user can create and manage a construction project.

**Project fields:**

```text
Project Name
Project Location
Start Date
End Date
Total Target Area
Project Status
Created By
```

The **Total Target Area** should not be manually typed if possible. It should be automatically computed from all Task Heads.

Example:

```text
Project: Residential Building Phase 1

Task Heads:
- Site Preparation: 100 sq.m
- Masonry Works: 250 sq.m
- Finishing Works: 180 sq.m

Total Project Target Area = 530 sq.m
```

---

### C. Task Head / Scope of Work Module

This is important because the client said merong **Task Head**, and under it may specific tasks.

Example:

```text
Task Head: Installation of Walls
Specific Tasks:
- CHB Laying
- Plastering
- Finishing
```

**Task Head fields:**

```text
Task Head Name
Project ID
Target Area
Start Date
End Date
Progress Percentage
Status
```

The Task Head progress should be based on the sum of actual completed area from its specific tasks.

---

### D. Specific Task Module

Each Task Head can have multiple specific tasks under it.

**Specific Task fields:**

```text
Task Name
Task Head ID
Target Area
Unit of Measurement
Start Date
End Date
Assigned Skilled Workers
Assigned Helpers / Laborers
Standard Output
Actual Completed Area
Progress Percentage
Status
```

This is where the actual productivity tracking happens.

Example:

```text
Task Head: Installation of Walls

Specific Task: CHB Laying
Target Area: 250 sq.m
Actual Completed Area: 100 sq.m
Progress: 40%
Assigned Manpower: 1 Skilled + 2 Helpers
```

---

### E. Progress Update Module

This is where the supervisor inputs weekly or monthly progress.

Since the client said **actual completed area** ang input, the system should compute percentage automatically.

```text
Progress % = Actual Completed Area / Target Area × 100
```

Example:

```text
Target Area: 250 sq.m
Actual Completed Area: 100 sq.m

Progress = 40%
```

**Progress update fields:**

```text
Task ID
Update Type: Weekly / Monthly
Date Covered
Actual Completed Area
Remarks
Updated By
Date Submitted
```

For MVP, progress updates can be displayed as:

- loading bar
- percentage
- actual completed area vs target area

---

### F. Labor Productivity Computation Module

This is the most important part of the system because this is the focus of their research.

The system should compare:

```text
Target Area
Actual Completed Area
Remaining Area
Remaining Days
Standard Output of Workers
Assigned Workers
Deadline
```

The client mentioned that their standard is:

```text
1 Skilled Worker + 2 Helpers/Laborers
```

and they already have an Excel formula and standard output for this 3-man worker setup.

For MVP, the system can use their existing Excel formula as the basis.

**Possible computation logic:**

```text
Expected Output = Standard Output × Number of Worker Sets × Working Days
```

Since they said skilled and helpers are linear:

```text
1 worker set = 1 skilled + 2 helpers
2 worker sets = 2 skilled + 4 helpers
3 worker sets = 3 skilled + 6 helpers
```

Then the system checks if the actual output is enough based on the deadline.

---

### G. Status Indicator Module

This module will automatically determine the task status.

Suggested statuses:

```text
On Track
At Risk
Delayed
Critical
Completed
Labor Productivity Issue
```

**Suggested logic:**

```text
On Track:
Actual output is equal to or higher than expected output.

At Risk:
Weekly progress is below expected output, but still possible to catch up.

Delayed:
Task is already behind schedule.

Critical:
Monthly progress shows that the task is far from the target and close to deadline.

Labor Productivity Issue:
Actual output is too low compared to expected labor output.
```

Since the client said **weekly warning** and **monthly critical indicator**, the system can work like this:

```text
Weekly Check = Warning / At Risk
Monthly Check = Critical / Productivity Issue
```

---

### H. Calendar / Scheduling Module

Since the client confirmed that all tasks should be aligned to a calendar, the app needs a calendar view.

**Calendar should show:**

```text
Task Head
Specific Tasks
Start Date
End Date
Current Status
Progress Percentage
```

This can help the Site Engineer see:

- what tasks are ongoing
- what tasks are upcoming
- what tasks are delayed
- what tasks are critical

For MVP, kahit simple calendar or timeline view muna is enough.

---

### I. Dashboard Module

The dashboard should summarize the entire project.

**Dashboard cards:**

```text
Total Project Progress
Total Target Area
Total Completed Area
Ongoing Tasks
Delayed Tasks
Critical Tasks
Labor Productivity Issues
Monthly Productivity Summary
```

**Suggested dashboard layout:**

```text
Top Section:
- Project Name
- Overall Progress
- Start Date / End Date
- Total Target Area
- Total Completed Area

Middle Section:
- Task Head cards with progress bars

Bottom Section:
- Warning / Critical tasks
- Monthly productivity summary
```

---

### J. Monthly Report Module

Since the client prefers monthly reports, include this in the MVP.

**Monthly report should show:**

```text
Project Name
Month Covered
Task Heads
Target Area
Actual Completed Area
Progress Percentage
Delayed Tasks
Critical Tasks
Productivity Issues
Suggested Action
```

Example suggested action:

```text
Task: Plastering
Status: Critical
Reason: Actual output is below expected monthly output.
Suggestion: Add manpower or adjust schedule.
```

For MVP, this can be displayed inside the system first. PDF export can be optional for the next version.

---

# Suggested MVP Database Tables

## users

```text
id
name
email
password
role
created_at
```

## projects

```text
id
project_name
location
start_date
end_date
total_target_area
total_completed_area
overall_progress
status
created_by
created_at
```

## task_heads

```text
id
project_id
name
target_area
completed_area
progress_percentage
start_date
end_date
status
created_at
```

## tasks

```text
id
task_head_id
name
target_area
unit
completed_area
progress_percentage
start_date
end_date
skilled_workers
helpers
standard_output
status
created_at
```

## progress_updates

```text
id
task_id
update_type
date_covered
actual_completed_area
remarks
updated_by
created_at
```

## productivity_standards

```text
id
task_type
skilled_workers
helpers
standard_output
unit
created_at
```

## reports

```text
id
project_id
month
summary
status
created_at
```

---

# MVP User Flow

```text
1. User logs in.
2. User creates a project.
3. User adds Task Heads.
4. User adds Specific Tasks under each Task Head.
5. User sets target area, schedule, and manpower.
6. User inputs weekly or monthly actual completed area.
7. System computes progress percentage.
8. System checks if the task is On Track, At Risk, Delayed, Critical, or has Labor Productivity Issue.
9. Dashboard updates automatically.
10. Monthly report is generated.
```

---

# Recommended MVP Pages

## 1. Login Page

For Admin and Supervisor/Site Engineer/QA-QC.

## 2. Dashboard Page

Shows project overview, progress bars, delayed tasks, and productivity warnings.

## 3. Projects Page

List of all projects.

## 4. Project Details Page

Shows:

```text
Project summary
Task Heads
Specific Tasks
Overall progress
Schedule
```

## 5. Task Head Details Page

Shows all specific tasks under that scope.

## 6. Progress Update Page

Where supervisor inputs actual completed area.

## 7. Calendar Page

Shows scheduled tasks aligned with dates.

## 8. Monthly Reports Page

Shows monthly productivity and progress summary.

---

# Suggested MVP Tech Stack

Since this is an MVP, use a simple and fast stack:

```text
Frontend: React / Next.js
Backend: Next.js API Routes or Node.js + Express
Database: PostgreSQL / Supabase
Authentication: Supabase Auth or custom auth
Charts: Recharts
Calendar: FullCalendar or custom calendar component
Deployment: Vercel
```

For fast development, I suggest:

```text
Next.js + Supabase + Vercel
```

Reason:

- Faster to build
- Good for web dashboard
- Easy authentication
- Easy database setup
- Can be responsive for mobile/tablet

---

# Simple Architecture Diagram

```text
┌──────────────────────────────┐
│ Supervisor / Site Engineer   │
│ QA/QC User                   │
└───────────────┬──────────────┘
                │
                v
┌──────────────────────────────┐
│ Responsive Web Application   │
│ Next.js / React              │
└───────────────┬──────────────┘
                │
                v
┌──────────────────────────────┐
│ Application Modules          │
│ - Dashboard                  │
│ - Project Management         │
│ - Task Head Management       │
│ - Specific Task Management   │
│ - Progress Updates           │
│ - Calendar Scheduling        │
│ - Monthly Reports            │
└───────────────┬──────────────┘
                │
                v
┌──────────────────────────────┐
│ Backend API / Business Logic │
│ - Progress Computation       │
│ - Productivity Checking      │
│ - Status Classification      │
│ - Report Generation          │
└───────────────┬──────────────┘
                │
                v
┌──────────────────────────────┐
│ Database                     │
│ - Users                      │
│ - Projects                   │
│ - Task Heads                 │
│ - Tasks                      │
│ - Progress Updates           │
│ - Productivity Standards     │
│ - Reports                    │
└──────────────────────────────┘
```

---

# Development Roadmap for MVP

## Phase 1 — Planning and Data Structure

Finalize:

```text
Project fields
Task Head fields
Specific Task fields
Progress formula
Productivity formula
Status rules
```

Output:

```text
Final feature list
Database schema
User flow
```

## Phase 2 — UI/UX Design

Create screens:

```text
Login
Dashboard
Project List
Project Details
Task Details
Progress Update Form
Calendar View
Monthly Report View
```

The AI-generated design can be used as visual inspiration, but the layout should follow the actual workflow.

## Phase 3 — Core Development

Build:

```text
Authentication
Project CRUD
Task Head CRUD
Specific Task CRUD
Progress update input
Automatic progress computation
```

## Phase 4 — Productivity Logic

Build the logic for:

```text
Weekly warning
Monthly critical indicator
Labor productivity issue detection
Manpower-based output checking
```

## Phase 5 — Dashboard and Reports

Build:

```text
Progress cards
Loading bars
Status indicators
Monthly productivity summary
Project summary
```

## Phase 6 — Testing and Validation

Test:

```text
Progress computation
Task Head total computation
Project total computation
Weekly warning logic
Monthly critical logic
Calendar display
Report accuracy
```

---

# MVP Scope Recommendation

For the first version, focus only on this:

```text
Project creation
Task Head creation
Specific Task creation
Target area setup
Schedule setup
Manpower input
Actual completed area input
Progress percentage computation
Weekly warning
Monthly critical status
Dashboard summary
Calendar view
Monthly report
```

Do not include yet:

```text
Cost estimation
Photo upload
Worker attendance
PDF export
Mobile app
Advanced analytics
Client viewer role
```

Those can be added after the MVP is working.

---

# Final Suggested System Name

**Web-Based Labor Productivity and Construction Progress Monitoring System**

or more specific:

**BuildTrack: A Web-Based Labor Productivity and Construction Progress Monitoring System for Site Engineers and QA/QC**

This architecture keeps the MVP clear, realistic, and aligned with their actual research focus.
