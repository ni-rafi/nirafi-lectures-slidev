## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of local repo skills that can be used. Each entry includes a name, description, and file path so the source can be opened when needed.

### Available skills
- math-engine: Guides extending the modular Quantity Surveying mathematical engine. (file: .agent/skills/math-engine/SKILL.md)
- commit-message: Generates Conventional Commit messages following project rules. Use when creating git commits or preparing commit messages. (file: .agent/skills/commit-message/SKILL.md)
- react-feature-standard: Standard structure and conventions for developing reusable React features and slide-deck lectures. (file: .agent/skills/react-feature-standard/SKILL.md)

### How to use skills
- Discovery: The list above is the skills available in this repository (name + description + file path). Skill bodies live on disk at the listed paths.
- Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill description above, use that skill for that turn. Multiple mentions mean use them all. Do not carry skills across turns unless re-mentioned.
- Missing/blocked: If a named skill is not in the list or the path cannot be read, say so briefly and continue with the best fallback.
- How to use a skill (progressive disclosure):
  1) After deciding to use a skill, open its `SKILL.md`. Read only enough to follow the workflow.
  2) When `SKILL.md` references relative paths, resolve them relative to the skill directory first, and only consider other paths if needed.
  3) If `SKILL.md` points to extra folders such as `references/`, load only the specific files needed for the request; do not bulk-load everything.
  4) If `scripts/` exist, prefer running or patching them instead of retyping large code blocks.
  5) If `assets/` or templates exist, reuse them instead of recreating from scratch.
- Coordination and sequencing:
  - If multiple skills apply, choose the minimal set that covers the request and state the order used.
  - Announce which skill(s) are being used and why (one short line). If an obvious skill is skipped, say why.
- Context hygiene:
  - Keep context small: summarize long sections instead of pasting them; only load extra files when needed.
  - Avoid deep reference-chasing: prefer opening only files directly linked from `SKILL.md` unless blocked.
  - When variants exist (frameworks, providers, domains), pick only the relevant reference file(s) and note that choice.
- Safety and fallback: If a skill cannot be applied cleanly (missing files, unclear instructions), state the issue, choose the next-best approach, and continue.

## Rules
Rules define cross-cutting constraints and standards. They complement skills (skills = workflow, rules = guardrails).

### Available rules
- core: Always-on workspace constraints, directory topology, and project principles. (file: .agent/rules/001-core-rules.md)
- testing: Vitest and compiler validation expectations. (file: .agent/rules/002-testing-rules.md)
- quantity-surveying: SI inputs, output rounding precision, and engine boundaries. (file: .agent/rules/003-qs-rules.md)
- commit-message: Conventional Commits formatting rules and best practices. (file: .agent/rules/004-commit-message-rules.md)

### Rule loading strategy
- Always load: `001-core-rules.md`
- Testing/CI tasks: load `002-testing-rules.md`
- Quantity Surveying engine tasks: load `003-qs-rules.md`
- Commit/PR tasks: load `004-commit-message-rules.md`
- Keep context small: load only the minimal rule set required for the task
