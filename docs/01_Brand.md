# Brand

This file is the template for defining a client's brand inside the codebase.
Fill it in at kickoff for every new project — before writing a single
section component — so design and copy decisions have a single source of
truth instead of living in someone's head or a Figma comment thread.

## Identity

Record the client's name, one-line positioning statement, and the audience
they're speaking to. A positioning statement should be specific enough that
it would sound wrong applied to a competitor: "the fastest way for
mid-market retailers to launch a loyalty program" is useful; "innovative
solutions for modern businesses" is not.

## Voice and tone

Describe how the brand talks, with a few real example sentences in that
voice and a few counter-examples of what it should never sound like.
Useful axes to define: formal vs. casual, playful vs. serious, technical
vs. plain-spoken, first person ("we") vs. third person. Every page's copy —
hero headlines, button labels, error states, empty states — should be
checked against this section, not just the marketing pages.

## Visual identity

Point to the actual token values in `app/globals.css` (`--primary`,
`--secondary`, `--accent`, `--font-display`, `--font-sans`) rather than
duplicating hex codes here — this section should explain the _reasoning_
(why this palette, why this typeface pairing, what mood they're meant to
evoke) while `docs/Design-System.md` and the CSS file are the source of
truth for values. Note any brand guideline constraints (approved logo
lockups, minimum clear space, colors that must never touch).

## Imagery and iconography

Describe the photographic style (candid vs. staged, color grade, subject
matter to avoid), illustration style if any, and confirm Lucide Icons is
the icon set unless the brand has a licensed custom set. Store final
assets in `public/images` and `public/videos`, organized by page or
section, not by asset type.

## Do / don't

A short, concrete list of brand guardrails discovered during the project —
copy patterns that tested badly, colors the client vetoed, competitor
comparisons to avoid. This section is meant to accumulate over the life of
the project; add to it rather than rewriting it.
