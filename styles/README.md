# styles/

Next.js only auto-loads global CSS imported from `app/layout.tsx`, so the
canonical design tokens and Tailwind entry point live in `app/globals.css`
(imported once, at the root layout).

This folder is for **additional, optional stylesheets** you explicitly
import where needed — for example a `print.css`, a third-party widget
override, or a large `@font-face` block for a self-hosted client typeface.
Keep it empty until a project actually needs one; don't split the core
design tokens across multiple files.
