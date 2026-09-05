# Coding Interview Instructions

Welcome, and thank you for taking part in Today's Carolinian's Web Development Coding Interview.
This interview evaluates your skills with **version control** as much as your coding — please read
these instructions carefully before you start.

All of your interview materials live in a single GitHub repository, `todayscarolinian/interview`
(the repository). You don't need any prior familiarity with it — everything you need to know is in
this document.

> ⚠️ **Access window:** You will be given access to the repository **24 hours before your
> scheduled interview time**, granted to the GitHub account/username you submitted in the Google
> Form. Make sure that submission is accurate — access cannot be granted to a different account.
>
> ⚠️ **Deadline:** You must push your branch and open your Pull Request **at least one (1) hour
> before your scheduled interview time.** Your access to the repository is cut off at that point,
> and no late submissions will be accepted. Plan your time accordingly — don't wait until the last
> minute.

## 1. Clone the repository

```bash
git clone git@github.com:todayscarolinian/interview.git
cd interview
```

(If you haven't set up SSH access with GitHub, you can instead clone over HTTPS:
`https://github.com/todayscarolinian/interview.git`)

## 2. Switch to your assigned branch

Twenty-four (24) hours before your scheduled interview, you will be granted access to the
repository (via the GitHub account/username you submitted in the Google Form) and assigned a
branch named `task/<your-student-id>` (e.g. `task/22103454`, using your own student ID). If you
try to clone or access the repository before that window and it fails, that's expected — try again
once your interview is within 24 hours. Fetch and check it out:

```bash
git fetch origin
git checkout task/<your-student-id>
```

## 3. Read your task

Once you're on your branch, open the `TASK.md` file at the root of the repository. It describes the specific
task assigned to you based on your skillset. If `TASK.md` is missing or unclear, reach out (see
Section 6) before proceeding.

## 4. Do the work

Implement your task on your branch. Commit your progress as you go — meaningful, incremental commits
are part of what's being evaluated, not just the final result.

```bash
git add <files>
git commit -m "your message here"
```

## 5. Push and open a Pull Request

**You must push your branch and open your Pull Request at least one (1) hour before your scheduled
interview time.** Your access to the repository will be cut off at that point — anything not
pushed and opened as a PR by then will not be reviewed. Do not wait until the last minute.

```bash
git push origin task/<your-student-id>
```

Then open a Pull Request on GitHub from `task/<your-student-id>` into `main`. This must be done
**one hour before your interview**, no exceptions.

## 6. Questions during the interview

If you get stuck, have questions about your task, or run into setup issues, reach out to:

- **Messenger:** https://www.facebook.com/peterosneal
- **Email:** n.peteros2003@gmail.com

Don't hesitate to ask — clarifying questions are a normal part of the process.

## Quick checklist

- [ ] Cloned the repository
- [ ] Checked out `task/<your-student-id>`
- [ ] Read `TASK.md`
- [ ] Committed my work incrementally
- [ ] Pushed my branch **at least 1 hour before my interview**
- [ ] Opened a Pull Request into `main` **at least 1 hour before my interview**

Good luck!
