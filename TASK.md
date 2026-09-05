# Your Task

Build a **staff directory page** using the provided mock API.

## API

```
GET https://6a9c31af0ad174e139e91538.mockapi.io/api/users
```

This returns a JSON array of **all 100 users at once** — the endpoint does not support
server-side pagination or filtering. Each user object looks like this:

```json
{
  "id": "1",
  "createdAt": "2026-09-05T02:05:11.525Z",
  "name": "Winifred Keebler",
  "avatar": "https://avatars.githubusercontent.com/u/29009586",
  "email": "Isidro_Satterfield@gmail.com",
  "department": "Baby",
  "status": false
}
```

## Requirements

1. **Fetch and display** users from the API above, respecting pagination in the UI — your choice
   of page controls or infinite scroll. Since the API returns the full dataset in one call, this
   pagination will necessarily be implemented client-side (paginate over the data you already
   fetched).
2. **Search/filter** by name and/or department. Client-side or server-side is your choice.
3. Include an **Add/Edit User** form, presented however you'd present a modal/overlay form, that
   lets you create a new user or edit an existing one from the list.
4. **Validate** the form (required fields, email format, etc.) and show clear success/error
   feedback.
5. On a successful add/edit, **reflect the change in the UI immediately**. This is a **local-only**
   change — you do not need to persist it back to the mock API (no POST/PUT required).

## Approach

You have full technical freedom here — we're evaluating how you think and build, not whether you
reach for a specific library. Some suggestions if you want a starting point (none are required):

- **shadcn/ui** `Dialog` + `Form` components for the add/edit UI
- **`react-hook-form` + `zod`** for form state and validation

Use these, swap in alternatives you're more comfortable with, or hand-roll it — any reasonable
approach that satisfies the requirements and success criteria below is fair game.

> ✅ You're welcome to use AI tools (ChatGPT, Copilot, Claude, etc.) while working on this.

## Notes

- None of the above (shadcn/ui, `react-hook-form`, `zod`) is pre-installed in this repo — if you
  choose to use them, you'll need to install/init them yourself.
- Commit your progress incrementally — see `INSTRUCTIONS.md` for submission steps and the
  deadline.

## Success Criteria

- [ ] All 100 users load from the API and are paginated in the UI (page controls or infinite
      scroll) rather than dumped as one long list.
- [ ] Search/filter by name and/or department works and updates the visible list.
- [ ] "Add User" opens a modal/overlay form, and a successful submit adds the new user to the
      visible list without a page reload.
- [ ] "Edit User" pre-fills the same form with the selected user's data, and a successful submit
      updates that user in place in the visible list.
- [ ] Required fields are enforced and email is validated as a proper email format, with
      inline/field-level error messages (not just a blocked submit).
- [ ] A clear success indicator appears after a successful add/edit (e.g. toast, inline message).
- [ ] No console errors/warnings during normal use (fetch, paginate, search, add, edit).
- [ ] Git history shows incremental, meaningful commits — not a single "final" commit — and the
      PR is opened from `task/24103848` into `main` before the deadline in `INSTRUCTIONS.md`.
