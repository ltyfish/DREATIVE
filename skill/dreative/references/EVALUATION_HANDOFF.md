# Opted-in evaluator handoff

Read this only when `.dreative/evaluation/README.md` exists in the target
project. Its absence is the normal case and needs nothing from you.

That file is an explicit opt-in review contract. Read it and update its
designated current-run decision record with the prompt, selected direction,
concise rationale, implementation promise, and later material decision changes.
Include product observations, the alternatives considered at a summary level,
and selection reasons with their triggers.

Identify the exact current branch and commit (or explicitly say `uncommitted`
until one exists), and update them after the final commit.

Treat only files designated by that README as evaluator input. Legacy
`.dreative` critic, verify, certification, trace, or evidence files are not
current evidence; remove stale untracked copies before handoff so they cannot be
mistaken for the submitted build.

Record inspectable conclusions, never hidden chain-of-thought, private
exploration, raw transcripts, or discarded scratch work. This handoff reports
decisions; it does not replace the private brief and does not become an approval
gate.

At completion, update the designated review record with what actually shipped,
observable verification results, corrections, limitations, and current
screenshot paths. Follow the local package's size and naming rules.

Never create or accumulate evaluation files in projects that did not opt in, and
never route prototypes, bundles, caches, traces, browser profiles, or raw
evidence into the review package.
