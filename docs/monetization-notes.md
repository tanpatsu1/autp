# Monetization Notes

## Position

Monetization is promising, but it should not be executed now. No billing, paid plans, affiliate activation, purchases, paid services, ad spend, domain purchase, or public launch should occur without explicit human approval.

The product should first prove:

- private persistence;
- trusted ownership and RLS;
- useful save/find/compare behavior;
- repeat use;
- clear privacy expectations;
- AI quality and cost boundaries if AI becomes paid.

## Strongest Monetization Paths

| Path | Why It Could Work | Required Foundation |
| --- | --- | --- |
| Higher saved-item or board limits | Natural for heavy organizers and shoppers | Auth, persistence, quotas, export expectations |
| Premium templates | Shopping, fashion, student research, travel, gift planning | Stable template model |
| AI summaries and comparison briefs | Saves time for users with many candidates | AI evaluation, cost controls, output storage, consent |
| AI tag/category suggestions | Reduces organization effort | User confirmation and undo |
| Export | Useful for students, research, shopping approval, personal records | Stable data model and privacy copy |
| Shared boards | Useful for families, partners, classmates, small teams | Collaboration permissions and RLS |
| Reminders / revisit prompts | Supports decision loops | Notification policy and user settings |
| Affiliate experiments | Possible fit for shopping | Human approval, disclosure, tracking, trust review |

## Free Product Candidate

The free product should include enough value to build trust:

- save links;
- title, category, tags, memo, favorite;
- search;
- edit/delete own items;
- card/list views;
- basic filters after implemented;
- enough saved items to prove real use.

Charging before the free save-find-compare loop works would weaken adoption.

## Paid Candidate Bundles

| Bundle | Included Ideas | Notes |
| --- | --- | --- |
| Organizer Plus | More boards, saved filters, custom fields, export | Lowest AI risk. |
| AI Assist | Summaries, tag suggestions, grouping, comparison drafts | Needs cost and quality controls. |
| Template Pack | Shopping, fashion, student, travel, gift, service templates | Good after generic decision fields work. |
| Shared Boards | Family, partner, classmate, or small-team decisions | Requires permissions and abuse/privacy review. |

## Monetization Risks

| Risk | Why It Matters | Guardrail |
| --- | --- | --- |
| Billing / paid plan changes | HumanGate | Do not execute without approval. |
| Affiliate incentives | Can reduce trust | Require disclosure and user approval before activation. |
| AI cost drift | Could make paid feature unprofitable | Add rate limits, logging, and cost estimates first. |
| Price tracking claims | Accuracy can be hard to guarantee | Do not claim live tracking until implemented and verified. |
| Sensitive vertical monetization | Health/life data creates trust and privacy concerns | Defer hospital/life paid features. |
| Data lock-in | Users need trust before paying | Plan export and deletion expectations. |

## Early Marketing / Monetization Policy

- Draft copy locally only.
- Keep pricing as notes until approved.
- Keep affiliate ideas as notes until approved.
- Do not add checkout, payment providers, billing dashboards, paid domains, or public pricing pages in automation.
- Review Gate must check monetization copy for unsupported claims.
