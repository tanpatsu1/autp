---
name: autp-growth
description: Draft autp growth, marketing, onboarding, FAQ, positioning, launch copy, and user-facing messaging without posting externally. Use when Codex should prepare content for review while respecting human confirmation for SNS, public platforms, paid promotion, and final launch.
---

# Autp Growth

## name
autp-growth

## description
Prepare growth and onboarding content for autp without publishing it externally.

## when_to_use
Use this skill for marketing copy, onboarding text, FAQ drafts, positioning, landing copy drafts, release notes, user education, and launch messaging drafts.

## required_context
Read:

- `AGENTS.md`
- `docs/current-status.md`
- `docs/automation-policy.md`
- `docs/task-board.md`
- `docs/feedback-inbox.md`
- relevant README, launch, or product docs

## workflow
1. Identify the audience and the product moment.
2. Draft clear, practical copy that matches autp's URL, brand, and link manager purpose.
3. Keep claims honest and aligned with implemented or planned behavior.
4. Save drafts in project docs or PR text, not external platforms.
5. For any requested public post, add an entry to `docs/feedback-inbox.md` instead of posting.
6. Hand off launch-sensitive content to Launch and Review Gate.

## output_format
Return:

- Audience
- Draft copy
- Placement
- Assumptions
- Human-confirmation items
- Next recommended task

## allowed_actions
- Draft marketing, onboarding, FAQ, README, and launch copy.
- Update local docs.
- Propose content tasks.
- Create PRs containing draft content.

## requires_human_confirmation
Require confirmation before posting to X, Instagram, YouTube, TikTok, Discord, Reddit, SNS, external websites, paid promotion, purchases, billing changes, domains, final public launch, secret exposure, service role key use, or production destructive changes.

## forbidden_actions
- Do not publish externally.
- Do not buy ads or paid tools.
- Do not claim unreleased features are live.
- Do not expose secrets or real env values.

## completion_criteria
The growth task is complete when draft content is saved locally or in the PR, public posting is blocked for human confirmation, and the next review or launch step is clear.
