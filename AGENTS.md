You should read README.md if you have not already.

## PRs
All PRs with significant LLM contributions must be labelled `ai` on GitHub.
Explicit user consent is required for PR/issue comments, resolutions, and creation.
Do not prefix PR titles with `[]` blocks, these are for human usage.
PR descriptions should consist solely of a concise bullet point list of changes (potentially including motivations & nuances), optionally prefaced by terse prose describing broader goals. May also reference issues/other PRs. Avoid test plans.
Prefer stacked PRs for more complex issues. Do not reference other PRs in the stack in PR descriptions.

## Design principles
This codebase is as much pedagogical as it is functional: contributors are often first-time coders, so in conversation, prefer explaining non-obvious decisions, asking the user to clarify ambiguous requests, and clearly presenting tradeoffs when present. Skew toward step-by-step iterative and interactive coding rather than large one-shots. Users may, however, override this as desired if they wish to rip and ship.

Ask before adding dependencies (bundle size is limited), editing README/AGENTS.md, or modifying scripts for local dev or CI.
Prefer following existing patterns. Search the codebase for inspiration and reference. Note, however, that this is a legacy codebase which is edited by student maintainers over many generations. As such it may contain outdated, unused, or poorly-understood code.
Keep diffs scoped to the issue at hand, and ask for consent and/or clearly note drive-by refactors and bugfixes; prefer splitting these into new branches when they are not directly tied to the in-progress feature.

Avoid disturbing existing comments unless they become outdated, and add new comments only when changes are non-obvious. Do not add comments which describe change history. Prefer single terse lines with no trailing punctuation. Avoid extremely lengthy/comprehensive documentation.

## Code
Write new files in TypeScript.
Reuse components from `src/components/ui`; same-named files in `src/components` only re-export these.
Only test real logic; avoid trivial component tests.

Use existing color variables from `src/components/ui/tokens.css` (shared) or `src/components/stylesheets/Colors.css` (feature-specific). New colors must go in one of these, with a dark theme value. Check both themes.
PurgeCSS strips classes it cannot find in the built code. Class names assembled at runtime (e.g. `status-${x}`) work in dev but may disappear once deployed; safelist them in `purgecss.config.js`.

UI should feel stable: reserve space for loading and expanding content, avoid decorative motion, and respect reduced motion. Keep body text at 16px.

## Workflows
Consider three stages of development:
- local development (do whatever you want)
- dev server (`master`; code should be thought out, prototype-complete, and reasonable, but is subject to change/testing)
- prod server (lags behind dev and is synchronized by pinning a commit sha; code must be complete and stable)

You may **never** update prod yourself, either by running `yarn sync-prod` or updating `prod-sha`; such updates are human-only.

`yarn start` serves locally, proxied to the dev server's API by default. Use `WSO_API_PROXY=http://localhost:8080 yarn start` for a local backend, matching its port.
Before finishing, run `yarn build`, `yarn test:ci`, `yarn lint`, and `yarn format:check`. The user may run `yarn test` for interactive testing.

API types and calls come from wso-api-client, which is generated from the wso-go API; do not work around missing or incorrect types here. Update with `yarn codegen --latest`.
For full-stack local development, see AGENTS.md in wso-go. Do not commit local client dependencies.
