---
name: autp-skill-discovery
description: Audit existing autp skills, identify missing role or workflow skills, consult project documentation and official Codex skill guidance when needed, maintain docs/skill-registry.md and docs/skill-discovery-log.md, and propose new skill creation PRs for autp automation.
---

# Autp Skill Discovery

## name
autp-skill-discovery

## description
Discover, evaluate, and register Codex skills that improve autp's autonomous multi-role operation.

## when_to_use
Use this skill when Codex must inspect `.agents/skills/`, decide which autp skills are missing, organize skill metadata, or propose new skills for future PRs.

## required_context
Read these files first:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/role-map.md`
- `docs/task-board.md`
- `docs/compact-context.md`
- `docs/verification-loop.md`
- `docs/feedback-inbox.md`
- `docs/skill-registry.md` if it exists
- `docs/skill-discovery-log.md` if it exists

When the task requires external Codex skill guidance, use official Codex documentation or the locally available skill-creator guidance. Prefer project docs for autp-specific decisions.

## workflow
1. List existing skill folders under `.agents/skills/`.
2. Read each `SKILL.md` frontmatter and skim body sections relevant to the discovery request.
3. Compare available skills against the role map, task board, verification loop, launch process, and automation policy.
4. Identify gaps, duplicates, stale skills, or skills that should be merged.
5. Update `docs/skill-registry.md` with active, proposed, or deprecated status.
6. Append a dated entry to `docs/skill-discovery-log.md` with what was searched, useful findings, proposed skills, and actions taken.
7. If a new skill should be created, propose a small PR or create it when the user has requested automatic skill additions.

## output_format
Return:

- Skills inspected
- Useful findings
- Proposed new skills
- Registry updates
- Discovery log entry
- PR or follow-up recommendation

## allowed_actions
- Read `.agents/skills/` and project docs.
- Create or update `docs/skill-registry.md`.
- Create or update `docs/skill-discovery-log.md`.
- Propose or add new skills.
- Open PRs for skill additions.

## requires_human_confirmation
Stop before external posting, paid services, purchases, billing changes, domains, secret exposure, service role key use, production destructive changes, weaker RLS, or final public launch.

## forbidden_actions
- Do not make external posts about skill proposals.
- Do not add real env values or secrets to examples.
- Do not change production data or production schema.
- Do not implement unrelated app features while doing skill discovery.

## completion_criteria
The discovery task is complete when existing skills are accounted for, missing skills are proposed or created, `docs/skill-registry.md` is current, `docs/skill-discovery-log.md` has a dated entry, and the next skill action is clear.
