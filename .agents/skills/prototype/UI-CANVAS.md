# UI Prototype (Cursor Canvas)

Generate **several radically different UI variations** in a Cursor Canvas — a live React panel the user opens beside the chat. No throwaway routes, no dev server, nothing committed to the repo unless the user wants it.

If the question is about logic/state rather than what something looks like — wrong branch. Use [LOGIC.md](LOGIC.md).

If the prototype must run **inside the real app** (real header, sidebar, auth, live data) — wrong sub-shape. Use [UI.md](UI.md) instead.

## When this is the right shape

- "What should this page look like?" — and you don't need the project's actual component library yet.
- "Show me a few layout options before I commit to code."
- "Try a different layout for the settings screen."
- Any time the user would otherwise spend a day picking between vague mockups in their head.
- You're in **Cursor** and the deliverable is a visual comparison, not a mergeable route.

## When to use in-repo instead ([UI.md](UI.md))

- The prototype must butt up against the **real app shell** — existing nav, density, fonts, data fetching.
- The question is "which layout works with *our* design system" not "which layout direction feels right."
- The user explicitly wants variants on an existing route with `?variant=`.

## Process

### 1. Read the Canvas skill

Before writing anything, read `~/.cursor/skills-cursor/canvas/SKILL.md`. It owns file location, SDK imports, design rules, and how to link the canvas in chat. This file only covers the **prototype-specific** shape on top of that.

### 2. State the question and pick N

Default to **3 variants**. Cap at 5 — beyond that, variants stop being radically different.

Write the plan in one line at the top of your chat response:

> "Three variants of the settings page, switchable in a canvas."

### 3. Generate radically different variants

Draft each variant as a separate component in the same `.canvas.tsx` file (`VariantA`, `VariantB`, …). Hold each one to:

- The page's purpose and the **mock data** it would show (embed data inline — no `fetch()`).
- A clear, descriptive name exported or referenced in the switcher, e.g. `B — Sidebar layout`.

Variants must be **structurally different** — different layout, different information hierarchy, different primary affordance, not just different colours. Three slightly-tweaked card grids isn't a UI prototype, it's wallpaper. If two drafts come out too similar, redo one with explicit "do not use a card grid" guidance.

Use `cursor/canvas` components (`Stack`, `Row`, `Grid`, `Card`, `Button`, `Table`, form controls, etc.). Read `~/.cursor/skills-cursor/canvas/sdk/index.d.ts` when you need exact exports — don't guess.

### 4. Wire a variant switcher

Use `useCanvasState` so the selected variant survives reloads:

```tsx
import { useCanvasState, Row, Button, Stack, H2 } from "cursor/canvas";

const VARIANTS = [
  { key: "A", label: "A — Dense table", Component: VariantA },
  { key: "B", label: "B — Sidebar layout", Component: VariantB },
  { key: "C", label: "C — Card grid", Component: VariantC },
] as const;

export default function SettingsPrototype() {
  const [idx, setIdx] = useCanvasState("variant-idx", 0);
  const { Component, label } = VARIANTS[idx];
  const prev = () => setIdx((i) => (i - 1 + VARIANTS.length) % VARIANTS.length);
  const next = () => setIdx((i) => (i + 1) % VARIANTS.length);

  return (
    <Stack gap={16}>
      <Component />
      <Row gap={8} justify="center">
        <Button variant="secondary" onClick={prev}>←</Button>
        <H2>{label}</H2>
        <Button variant="secondary" onClick={next}>→</Button>
      </Row>
    </Stack>
  );
}
```

Put the switcher at the **bottom** so it reads as chrome, not part of the design being evaluated. `Select` from the SDK works too when there are many variants.

### 5. Write the canvas file

- **Path:** `~/.cursor/projects/<workspace>/canvases/<descriptive-name>.canvas.tsx` — see the Canvas skill for how to resolve `<workspace>`.
- **One file only.** All variants and the switcher live in that single default export. No helper files.
- **Filename:** kebab-case, include `prototype` when helpful, e.g. `settings-layout-prototype.canvas.tsx`.

### 6. Hand it over

Link the canvas file in chat (full absolute path, per the Canvas skill). Tell the user they can open it beside the chat and flip variants with the switcher. The interesting feedback is usually **"I want the header from B with the sidebar from C"** — that's the actual design they want.

### 7. Capture the answer and clean up

Once a variant has won, write down which one and why (commit message, ADR, issue, or conversation). Then:

- **Delete the `.canvas.tsx` file** (and its `.canvas.data.json` sidecar if present) unless the user wants to keep it.
- **Implement the winner in the real codebase** — canvas code was written under prototype constraints and uses the Canvas SDK, not the project's components. Rewrite it properly when folding it in.

## Anti-patterns

Same as [UI.md](UI.md), plus:

- **Creating throwaway routes or JS files in the repo** when a canvas would answer the question. Repo pollution is the thing Canvas avoids.
- **Importing from the project** — canvases only import from `cursor/canvas`. Mock the shape of real data; don't wire to the app.
- **Skipping the Canvas skill** — location and SDK rules are strict; wrong paths produce blank canvases.
