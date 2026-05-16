# Client User Guide

This guide explains how to explore the Labor Productivity and Construction Progress Monitoring app. It is written for project owners, supervisors, site engineers, QA/QC staff, and other non-technical users.

The app helps your team answer three simple questions:

- What projects are active?
- What work is planned under each project?
- How much work has actually been completed compared with the planned target?

Each user only sees the projects and data created under their own account.

## 1. Log In

Open the app and sign in using the email and password provided for your account.

After logging in, you will land inside the main workspace. The navigation menu lets you move between Dashboard, Projects, Progress Updates, Calendar, Reports, and Settings.

## 2. Start With Projects

Go to `Projects`.

This page shows all projects created under your account. If this is your first time using the app, the list may be empty.

To create a project:

1. Click `New Project` or `Create Project`.
2. Enter the project name.
3. Enter the location.
4. Enter the total project area.
5. Select the project start date.
6. Select the project end date.
7. Save the project.

Example:

```text
Project name: Residential Building Phase 2
Location: Quezon City
Total project area: 500 sq.m
Start date: May 1, 2026
End date: July 30, 2026
```

The total project area is the fixed baseline. It should not change every time you add tasks.

## 3. Open a Project

After creating a project, click the project name or `Open`.

Inside the project page, you will see:

- Project timeline and progress
- Task head summary
- Task cards under each task head
- Overall completion percentage

At first, the project may show little or no progress because no task heads or tasks have been added yet.

## 4. Create Task Heads

Task heads are the main work packages or phase titles under a project.

Go to the project page and click `Manage task heads`.

To create a task head:

1. Choose a category: `Structural` or `Architectural`.
2. Enter the task head name.
3. Select the start date.
4. Select the end date.
5. Click `Create task head`.

Example:

```text
Category: Structural
Task head name: Site Preparation and Substructure
Start date: May 1, 2026
End date: May 30, 2026
```

Other examples of task heads:

- Masonry Works
- Formworks
- Concrete Works
- Finishing Works
- Painting Works

Task heads group related tasks together. They do not increase the total project area.

## 5. Create Specific Tasks

Specific tasks are the actual scope of work under a task head.

Go to `View all tasks` or open the task setup section under the project.

To create a task:

1. Select the task head where the task belongs.
2. Enter the specific task name.
3. Enter the target area.
4. Enter the unit, such as `sq.m`.
5. Select the start and end date.
6. Enter the skilled worker counts by role.
7. Enter the number of helpers.
8. Enter the output per hour.
9. Enter the time in hours.
10. Enter weeks per month and days per month.
11. Choose the task status.
12. Save the task.

Example:

```text
Task head: Masonry Works
Task name: CHB Laying
Target area: 250 sq.m
Unit: sq.m
Start date: May 7, 2026
End date: June 29, 2026
Mason: 1
Helpers: 2
Output per hour: 0.5
Time: 8
Weeks per month: 3
Days per month: 20
Status: On Track
```

The app will automatically compute the expected output.

Using the example above:

```text
Daily skilled output = 0.5 x 8 x 1 = 4 sq.m
Daily labor output = 4 / 2 = 2 sq.m
Weekly skilled output = 4 x 5 = 20 sq.m
Weekly labor output = 2 x 5 = 10 sq.m
Monthly skilled output = 20 x 3 = 60 sq.m
Monthly labor output = 10 x 3 = 30 sq.m
```

These values follow the same idea as the productivity rate sheet.

## 6. Choose Task Status Correctly

Each task has a status.

Use `On Track` when the task is moving normally.

Use `Completed` when the task is done.

Use `At Risk`, `Delayed`, or `Critical` when the task needs attention.

Use `Labor Productivity Issue` only when the site team confirms that productivity is the problem.

The status helps other users quickly understand which tasks need review.

## 7. Add Progress Updates

Progress updates are used to record actual completed work.

Go to `Progress Updates`.

To add a progress update:

1. Select the task.
2. Choose update type: `Weekly` or `Monthly`.
3. Select the date covered.
4. Enter the actual completed area.
5. Enter who updated it.
6. Choose the current task status.
7. Add remarks if needed.
8. Save the update.

Example:

```text
Task: CHB Laying
Update type: Weekly
Date covered: May 15, 2026
Actual completed area: 45 sq.m
Updated by: Site Engineer
Status: On Track
Remarks: Work is progressing normally.
```

The app will compute the progress percentage automatically.

Do not enter a percentage manually. Enter the actual completed area only.

## 8. Understand Progress

Task progress is based on:

```text
Actual completed area / Target area
```

Example:

```text
Target area: 250 sq.m
Completed area: 125 sq.m
Progress: 50%
```

Task head progress is based on all tasks under that task head.

Project progress is based on the completion of all task heads and tasks.

Progress is capped at 100%, so it will not go beyond full completion.

## 9. Edit a Task

Open a project and look at the task cards under a task head.

Click a task card to open the edit page.

You can update:

- Task name
- Target area
- Schedule
- Worker counts
- Helpers
- Output per hour
- Time
- Weeks per month
- Days per month
- Status

After saving, the app updates the task and recalculates the related progress values.

## 10. Delete Incorrect Data

If a task or task head was accidentally created, you can delete it.

The app will show a confirmation modal before deleting.

Deleting a task also removes its progress updates.

Deleting a task head also removes the tasks under it.

Only delete data if you are sure it was entered incorrectly.

## 11. Use The Dashboard

Go to `Dashboard`.

The dashboard gives a quick overview of your account's project data.

You can review:

- Total projects
- Overall progress
- Labor productivity issues
- Recent progress updates
- Warnings and critical work
- Productivity chart
- Action summary

Use the dashboard to quickly find what needs attention first.

## 12. Use The Calendar

Go to `Calendar`.

The calendar shows task schedules by date.

Use it to check:

- What work is active this week
- Which tasks are upcoming
- Which tasks may overlap
- Which tasks are delayed, critical, completed, or on track

Click a calendar item to review task details.

## 13. Use Reports

Go to `Reports`.

Reports summarize project health and highlight:

- Delayed tasks
- Critical tasks
- Labor productivity issues
- Suggested actions

Use reports for progress meetings and monthly project reviews.

## 14. Recommended Exploration Flow

If you are testing the app for the first time, follow this order:

1. Log in.
2. Create one project.
3. Open the project.
4. Create one task head.
5. Create two or three tasks under that task head.
6. Add weekly progress updates for each task.
7. Return to the project page and check progress.
8. Open the dashboard and review warnings.
9. Open the calendar and check schedules.
10. Open reports and review the project summary.

## 15. Sample Data To Try

Project:

```text
Project name: Residential Building Phase 2
Location: Quezon City
Total project area: 500 sq.m
Start date: May 1, 2026
End date: July 30, 2026
```

Task head:

```text
Category: Structural
Task head name: Masonry Works
Start date: May 7, 2026
End date: July 30, 2026
```

Task 1:

```text
Task name: CHB Laying
Target area: 250 sq.m
Unit: sq.m
Mason: 1
Helpers: 2
Output per hour: 0.5
Time: 8
Weeks per month: 3
Days per month: 20
Status: On Track
```

Task 2:

```text
Task name: Foundation
Target area: 250 sq.m
Unit: sq.m
Mason: 1
Helpers: 2
Output per hour: 0.45
Time: 8
Weeks per month: 3
Days per month: 20
Status: On Track
```

Progress update:

```text
Task: CHB Laying
Update type: Weekly
Actual completed area: 45 sq.m
Status: On Track
```

After saving the progress update, return to the project page to see the task and task head progress update.

## 16. Important Notes

Each user sees only the data created under their own account.

The app uses actual completed area to compute progress.

The app uses output per hour, time, worker count, and helpers to compute productivity output.

Project area is fixed during project setup. Adding tasks does not increase the total project area.

Task statuses are selected by the user so the site team can clearly flag issues.

