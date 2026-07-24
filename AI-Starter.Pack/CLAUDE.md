# CLAUDE.md

Instructions for Claude Code and any AI coding agent working in this repository.

This repository is part of a reusable premium web framework used to build high-end client websites.

Read this file BEFORE writing any code.

---

# AI Workflow (Mandatory)

For EVERY request, ALWAYS follow this workflow.

Never skip these steps.

## Phase 1 — Understand

1. Read the user's request carefully.
2. Read the relevant documentation inside `/docs`.
3. Understand the existing architecture.
4. Search for existing implementations before creating anything new.

---

## Phase 2 — Skills

Before doing anything, automatically discover and use the best installed skills.

Examples:

- UI → frontend-design
- UX → ui-ux-pro-max
- Styling → ui-styling
- Motion → design
- Design System → design-system
- Branding → brand
- Slides → slides

Always use the most relevant skill.

---

## Phase 3 — Ponytail

Before writing code ask yourself:

- Does this already exist?
- Is there already a component?
- Is there already a hook?
- Is there already a utility?
- Is there already an installed package?

Reuse before creating.

Never reinvent existing code.

Write the minimum amount of code required WITHOUT sacrificing readability.

Readable code is always preferred over clever code.

---

## Phase 4 — Context7

Whenever using:

- React
- Next.js
- Tailwind
- GSAP
- Motion
- Supabase
- Vercel
- TypeScript

Always consult Context7 documentation before implementation.

Never rely on outdated APIs.

---

## Phase 5 — Planning

Before editing code:

Understand

↓

Plan

↓

Explain the plan briefly

↓

Implement

↓

Review

Never jump directly into coding.

---

# Code Quality

Always produce production-ready code.

Rules:

- No duplicated code.
- No unnecessary abstractions.
- No unnecessary dependencies.
- No dead code.
- No unused imports.
- No console.log in production.
- No TODO left behind.
- No "quick fixes".

---

# Architecture

Server Components by default.

Client Components only when necessary.

Reuse before creating.

Small reusable components.

Single responsibility.

No circular dependencies.

Keep folder structure clean.

---

# Design Principles

Target quality:

- Apple
- Linear
- Stripe
- Framer
- Nike
- Vercel
- Aesop

Design should feel:

- premium
- elegant
- modern
- clean
- minimal
- polished

Never make generic-looking websites.

---

# Animations

Animations should:

- be meaningful
- improve UX
- feel premium

Preferred libraries:

- GSAP
- Motion

Respect:

prefers-reduced-motion

Never over-animate.

---

# Performance

Always optimize for:

- Lighthouse
- Core Web Vitals
- SEO
- Accessibility

Prefer:

- lazy loading
- code splitting
- image optimization
- minimal JavaScript
- server rendering

---

# Accessibility

Always include:

- semantic HTML
- keyboard navigation
- focus states
- ARIA labels
- correct heading hierarchy

Accessibility is mandatory.

---

# Styling

Never hardcode:

- colors
- spacing
- typography

Always use:

- design tokens
- Tailwind utilities
- project theme

---

# Existing Code

Before creating:

Component

↓

Hook

↓

Utility

↓

Library

↓

New implementation

Reuse first.

---

# Documentation

Whenever a project convention changes:

Update the corresponding file inside:

/docs

Documentation must never become outdated.

---

# Validation

Before considering a task complete:

- Review your own code.
- Check for duplication.
- Check responsiveness.
- Check accessibility.
- Check performance.
- Check TypeScript.
- Check lint errors.

---

# New Client Workflow

When starting a new client:

1. Configure site.ts
2. Configure nav.ts
3. Configure Supabase
4. Complete docs/Brand.md
5. Customize Design System
6. Build page by page
7. Reuse existing components
8. Validate
9. Deploy

---
Before proposing any implementation:

1. Explore multiple creative directions.
2. Compare them objectively.
3. Reject average ideas.
4. Select the strongest concept.
5. Only then start implementation.
# Prompts

Whenever a task is finished:

Run automatically:

npm run build

If successful:

git add .

git commit

git push

If build fails:

DO NOT COMMIT.

Fix every error first.

Only push production-ready code.
## Session Handoff Rule

Whenever a major milestone is completed or the conversation becomes long, create a Session Handoff before continuing in a new session.

The handoff must:

- preserve all important decisions;
- preserve the project status;
- preserve the next objective;
- preserve unresolved issues;
- follow the official handoff template.

Never rely only on the conversation history.

After every completed milestone:

1. Update memory/project.md
2. Update memory/decision.md
3. Update memory/todo.md
4. Create a new handoff inside AI-Starter.Pack/handoffs/
5. Save the generated plan inside AI-Starter.Pack/plans/
6. Only then consider the milestone completed.

## Milestone Completion Rule

A milestone is considered completed only after ALL of the following have been updated:

- project.md
- decision.md
- todo.md
- session handoff
- plans/