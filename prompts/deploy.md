# Prompt: Deploy

Use this prompt when preparing this project for a production deploy on
Vercel.

---

Prepare `<PROJECT_NAME>` for production deployment. Work through this
checklist and report status on each item — don't just say "done," show
the evidence (command output, file diff, or screenshot description).

1. **Environment variables** — confirm every variable in `.env.example`
   has a real value set in Vercel's project settings for Production (and
   Preview, if used): `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `NEXT_PUBLIC_SITE_URL` (the real production domain, not localhost),
   `NEXT_PUBLIC_SITE_NAME`, and any analytics IDs.
2. **Site config** — verify `config/site.ts` has real (non-placeholder)
   values: name, description, URL, OG image path, social links, author
   email.
3. **Validate** — run `npm run validate` (typecheck + lint + format
   check) and `npm run build` locally; fix anything that fails. A build
   that only works with `--no-lint` or similar workarounds is not ready.
4. **Supabase** — confirm `types/supabase.ts` was generated from the real
   schema (`npx supabase gen types typescript --project-id <id> > types/supabase.ts`),
   not left as the placeholder shape. Confirm Row Level Security policies
   are in place for any table the browser client touches directly.
5. **SEO** — confirm `/sitemap.xml` and `/robots.txt` resolve correctly
   on the deployed preview URL, and that `metadataBase` in
   `lib/metadata.ts` resolves to the real production URL (via
   `NEXT_PUBLIC_SITE_URL`).
6. **Images and fonts** — confirm any remote image hosts are added to
   `images.remotePatterns` in `next.config.ts`, or the build will fail
   on those images in production.
7. **Analytics/monitoring** — wire up whatever the client brief requires
   (Vercel Analytics, GA, error monitoring) — none is included by default.
8. **Custom domain** — confirm DNS is pointed at Vercel and the domain
   is verified in the Vercel dashboard before calling this done.
9. **Final smoke test** — after deploying, manually check: homepage loads
   with no console errors, dark mode toggle works, contact form submits
   successfully, all primary nav links resolve, mobile menu opens/closes.

Report any step you could not complete and why (missing credentials,
missing client content, etc.) rather than marking it done anyway.
