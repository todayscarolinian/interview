# Today's Carolinian — Web Development Coding Interview

This repository is used to conduct Today's Carolinian's Web Development Coding Interview.

The interview is designed to evaluate an applicant's skills starting with **version control**: each
applicant is assigned their own branch and must switch to it, implement their task, stage, commit,
and push their work, then open a Pull Request back into `main` for review.

## How it works

- Every applicant is given a dedicated branch, named `task/<student-id>` (e.g. `task/22103454`),
  created ahead of time by the interviewer.
- Each applicant's task is described in a `TASK.md` file on their branch. Tasks vary per applicant
  based on their specified skillset (frontend, backend, etc.).
- Applicants clone this repository, check out their assigned branch, complete the task described in
  `TASK.md`, and submit their work as a Pull Request from their branch into `main`.
- Applicants receive full setup and submission steps in [`INSTRUCTIONS.md`](./INSTRUCTIONS.md),
  which is emailed to them directly.

## Project stack

This is a [Next.js](https://nextjs.org) project.

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The main
page is at `app/page.tsx`.
