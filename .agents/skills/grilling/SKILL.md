---
name: grilling
description: Grill the user relentlessly about a plan or design. Use when the user wants to stress-test a plan before building, or uses any 'grill' trigger phrases.
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

If a *fact* can be found by exploring the codebase, look it up rather than asking me. The *decisions*, though, are mine — put each one to me and wait for my answer.

Do not enact the plan until I confirm we have reached a shared understanding.

## Question format

Use the `AskQuestion` tool for each decision. Put context, trade-offs, and your recommendation rationale in normal message text above the tool call — do not write numbered option lists in prose.

For each decision:

- Turn the fork into 2–4 concrete options plus **Something else (I will type it)** as the last option.
- Mark your recommended option with **(Recommended)** in the label.
- Use at most **one** `AskQuestion` per message.
- Wait for my answer before asking the next question.

If `AskQuestion` is unavailable, ask the same question in prose and keep it short.

When we have resolved all branches, use `AskQuestion` for the final check:

- **prompt:** "Have we reached a shared understanding?"
- **options:** "Yes — proceed", "Not yet — more to resolve", "Something else (I will type it)"
