# From One Giant AI PR to a Reviewable Stack

### Grounding Zava's AI shopping assistant with GitHub Stacked PRs

> A hands-on, end-to-end tutorial. You will watch three custom AI agents build a feature
> as a **stack of small, dependent pull requests**, and you will play the **human
> reviewer** who navigates, reviews, rebases, and merges that stack — natively on GitHub.

---

## Table of contents

- [Part 0 — Set the scene](#part-0--set-the-scene)
- [Part 1 — Setup & prerequisites](#part-1--setup--prerequisites)
- [Part 2 — Decompose the work](#part-2--decompose-the-work)
- [Part 3 — Layer 1: catalog data foundation](#part-3--layer-1-catalog-data-foundation)
- [Part 4 — Layer 2: product search API](#part-4--layer-2-product-search-api)
- [Part 5 — Layer 3: wire the chat to the API](#part-5--layer-3-wire-the-chat-to-the-api)
- [Part 6 — Layer 4: grounded UI & citations](#part-6--layer-4-grounded-ui--citations)
- [Part 7 — Submit the stack](#part-7--submit-the-stack)
- [Part 8 — Review as the human](#part-8--review-as-the-human)
- [Part 9 — Cascading rebase](#part-9--cascading-rebase)
- [Part 10 — Merge bottom-up](#part-10--merge-bottom-up)
- [Part 11 — Recap & takeaways](#part-11--recap--takeaways)
- [Appendix — `gh stack` command cheat-sheet](#appendix--gh-stack-command-cheat-sheet)

> **📸 Screenshot placeholders.** Throughout, you'll see `📸 Screenshot:` callouts marking
> good moments to capture an image for your final published version. Drop the image in
> right below the callout.

---

## Part 0 — Set the scene

### The symptom: AI pull requests arrive oversized and under-explained

Coding agents are astonishingly productive. Point one at "add product search to the
assistant" and minutes later you have a diff. But look closely at what tends to land in a
single agent PR:

- a new data model **and** its seed data,
- an API route **and** its validation,
- the client wiring **and** the UI **and** the empty/error states,

…all in **one 600-line diff**, described by a paragraph of generically upbeat prose.
Models are verbose by default, so the *volume* of change per PR trends large, while the
*context per line* trends thin. For a reviewer this is the worst combination: a big
surface area with a shallow explanation of **why** each piece looks the way it does.

The result is familiar. Reviewers lose the thread, feedback quality drops, the PR sits,
conflicts accumulate, and the change either merges under-reviewed or stalls entirely.

### The honest framing (read this before you get excited)

Stacked PRs are **not** a cure for the deeper problem. The deeper problem is a **capacity
and judgement gap**: agents can *generate* code far faster than humans can *responsibly
review* it, and no amount of tooling closes that gap on its own. Splitting a change into
five PRs does not create five times the review bandwidth, and it does not supply the
domain judgement a reviewer brings.

What stacked PRs **do** give you is a **native way for an agent to decompose** a large
change into a chain of small, focused, independently reviewable layers — instead of one
undifferentiated blob. Decomposition is a real, concrete mitigation for the *oversized,
low-context diff* symptom:

- each PR is **one concern**, so the "why" fits in a short description,
- each PR is **small**, so a human can actually hold it in their head,
- each PR **builds on the reviewed one below it**, so context accrues in order.

Think of it as turning "review this novel" into "review this novel one tight chapter at a
time, in order." The reviewing still has to happen — but now it *can*.

### What you'll build, and the two angles

You'll take Zava — a home-improvement retail store built with Next.js — and its
**mock** AI shopping assistant, and make the assistant **real**: grounded in an actual
product catalog, served by a real API, rendered with real product citations.

The feature is deliberately built as a **4-layer stack**, and you'll experience it from
**two distinct angles**:

| Angle | Who | What they do |
|-------|-----|--------------|
| **Author** | Three custom AI agents | Each agent owns one workstream and produces one (or two) layers of the stack |
| **Reviewer** | **You** | Navigate the stack map, review each focused layer, request a change, trigger a cascading rebase, and merge bottom-up |

Keeping the two angles separate is the point: it shows how agents can *produce* decomposed
work, and how a human stays firmly *in the loop* to evaluate it.

### ⚠️ Starting state: it's intentionally messy

Before we touch anything, be clear about where we start — because the mess **is the
motivation**.

Right now Zava's product data is **hardcoded and scattered** across three homepage
components, with **inconsistent shapes**:

- `src/app/components/home/FeaturedProducts.tsx` — prices are strings: `price: '$6.99/sq ft'`
- `src/app/components/home/PopularProducts.tsx` — prices are numbers: `price: 65000.00`
- `src/app/components/home/AllServices.tsx` — a different shape again

And the assistant itself is a **mock**. Open `src/app/contexts/ChatContext.tsx` and you'll
find the "AI" is a random-line generator:

```ts
// src/app/contexts/ChatContext.tsx (starting state)
function generateAIResponse(userMessage: string): string {
  const responses = [
    `I'd be happy to help you with that! ...`,
    `That's a great question! ...`,
    // ...picks one at random
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
```

There is **no catalog module, no API, and no data layer**. We are **not** going to clean
this up before we start. That scattered data and mock responder are exactly the problem
our stack exists to solve — Layer 1 consolidates the data, and the layers above turn the
mock into a grounded assistant. Leaving the starting point honest keeps the tutorial
honest.

> **📸 Screenshot:** the running app's homepage + the open chat widget replying with a
> generic canned line. This is your "before" shot.

---

## Part 1 — Setup & prerequisites

### 1.1 Run Zava locally

```bash
cd src
npm install
npm run dev
```

Open <http://localhost:3000>. Click the chat bubble (bottom-right), ask "do you sell
interior paint?", and watch it reply with a random, ungrounded line. That's our baseline.

### 1.2 Install the Stacked PRs CLI

Stacked PRs are a native GitHub feature. You can drive them entirely from the GitHub UI,
the API, or plain Git — but the `gh stack` CLI makes the local loop seamless.

```bash
# Install the CLI extension
gh extension install github/gh-stack

# (optional) alias `gh stack` as `gs`
gh alias set gs 'stack'
```

### 1.3 Teach your agents about stacks

This is the step that makes agent-authored stacks work. Install the **gh-stack skill** so
your coding agents know how to create, add to, submit, and rebase stacks on your behalf:

```bash
gh skill install github/gh-stack
# or, if you prefer:  npx skills add github/gh-stack
```

### 1.4 Meet the agent roster

This repo ships three custom agents under `.github/agents/`, each scoped to one workstream
in our stack:

| Agent | File | Owns | Layer(s) |
|-------|------|------|----------|
| **Data Modeler** | `data-modeler.agent.md` | Typed catalog model, synthetic data, data-access module | Layer 1 |
| **Backend** | `backend.agent.md` | Secure, validated search API route handler | Layer 2 |
| **Frontend** | `frontend.agent.md` | Wire chat → API, then render grounded product cards | Layers 3 & 4 |

Each agent's definition explicitly states **what belongs in its layer and what does not** —
that scoping discipline is what keeps each PR small and reviewable. Skim the three files
now; you'll invoke each agent in turn.

### 1.5 Confirm CI exists

Open `.github/workflows/ci.yml`. It runs **Lint**, **Typecheck**, and **Build** on every
pull request. Because GitHub evaluates each PR in a stack against its **final target
branch** (`main`), these three checks will run for **every layer** of the stack — not just
the bottom one. We'll see that on the stack map in Part 7.

---

## Part 2 — Decompose the work

Before creating a single branch, decide the layers. The guiding principle for a stack:

> **Foundational code goes low; code that depends on it goes high.** If code in one layer
> depends on code in another, the dependency must be in the same layer or a lower one.

"Ground the assistant in real data" decomposes cleanly along its dependency chain:

```
┌── feat/grounded-ui    → PR #4  presentation: product cards + states   (Frontend)   ← top
┌── feat/chat-grounding → PR #3  data flow: chat calls the search API   (Frontend)
┌── feat/search-api     → PR #2  API: GET /api/products/search          (Backend)
┌── feat/catalog-data   → PR #1  foundation: typed catalog + data       (Data Modeler) ← bottom
                          main
```

| # | Branch | Agent | Ships | Depends on |
|---|--------|-------|-------|------------|
| 1 | `feat/catalog-data` | Data Modeler | `src/app/lib/catalog/` — types, Zod schema, synthetic data, `searchProducts()` | `main` |
| 2 | `feat/search-api` | Backend | `src/app/api/products/search/route.ts` — validated `GET` endpoint | Layer 1 |
| 3 | `feat/chat-grounding` | Frontend | `ChatContext` calls the API and answers from real data | Layer 2 |
| 4 | `feat/grounded-ui` | Frontend | Product citation cards + empty/error states in the chat | Layer 3 |

**When to cut a new layer** (any one is enough):

- the concern changes (data → API → wiring → presentation),
- the reviewer audience changes (a data owner vs. a UI owner),
- the current layer is already big enough to review on its own.

Notice layers 3 and 4 are *both* Frontend but are still **separate PRs**: one is data-flow
logic, the other is presentation. Different concern ⇒ different layer, even with the same
author.

---

## Part 3 — Layer 1: catalog data foundation

**Branch:** `feat/catalog-data`  •  **Agent:** Data Modeler  •  **Base:** `main`

### 3.1 Start the stack

```bash
cd <repo-root>
gh stack init
# When prompted, name the first branch:  feat/catalog-data
# The stack uses your default branch (main) as its trunk.
```

> **📸 Screenshot:** the `gh stack init` prompt and confirmation.

### 3.2 Hand the work to the Data Modeler agent

Invoke the **Data Modeler** agent with a prompt like:

> Build the catalog data foundation under `src/app/lib/catalog/`. Consolidate the scattered
> hardcoded product data from the homepage components into a single typed domain model.
> Define `Product` and `Category` types, a Zod schema that validates the seed data at load,
> ~15–20 realistic home-improvement SKUs (deterministic, no randomness), and a pure
> data-access module exposing `getAllProducts()`, `getProductBySlug()`, and
> `searchProducts(query, limit)`. Money must be an integer minor-unit amount plus a
> currency code — never a display string. `searchProducts` must use safe case-insensitive
> substring matching (no `RegExp` built from user input). Do not add an API or touch React
> components — that's for the layers above.

**Expected shape of the diff** (yours may vary in detail):

```
src/app/lib/catalog/
├── types.ts       # Product, Category, Money (types inferred from the Zod schema)
├── schema.ts      # Zod schemas; validates data.ts at module load
├── data.ts        # ~15–20 deterministic synthetic products
└── index.ts       # getAllProducts / getProductBySlug / searchProducts
package.json        # + zod dependency
```

Representative slice of what "good" looks like for the query helper — note the **bounded
input** and **no dynamic RegExp**:

```ts
// src/app/lib/catalog/index.ts (illustrative)
export function searchProducts(query: string, limit = 5): Product[] {
  const q = query.trim().toLowerCase().slice(0, 100); // bound untrusted input
  if (!q) return [];
  return getAllProducts()
    .filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
    )
    .slice(0, Math.min(Math.max(limit, 1), 20));
}
```

### 3.3 Verify the layer locally

```bash
cd src && npm run lint && npx tsc --noEmit && npm run build
```

Everything green? Commit the layer:

```bash
git add -A
git commit -m "Add typed catalog data foundation (model, schema, synthetic data, access)"
```

> **Reviewer preview (Part 8 is where you review for real):** because this PR is *only* the
> data foundation, your future review question is simple and focused — "are the types right,
> is the data validated, is the query helper safe?" No API or UI noise to wade through.

---

## Part 4 — Layer 2: product search API

**Branch:** `feat/search-api`  •  **Agent:** Backend  •  **Base:** `feat/catalog-data`

### 4.1 Add the next layer

```bash
gh stack add
# Name the branch:  feat/search-api
```

`gh stack add` creates the new branch **on top of** `feat/catalog-data`, so this layer can
import the data-access module you just built.

### 4.2 Hand the work to the Backend agent

> Add a `GET /api/products/search` App Router route handler at
> `src/app/api/products/search/route.ts`. Validate the query string with Zod: `q` is a
> required, length-bounded string; `limit` is an optional integer clamped to 1–20. On
> invalid input return `400` with a minimal safe body. Call `searchProducts` from
> `src/app/lib/catalog` — do not re-implement matching. Return
> `{ query, count, results }` as JSON with a sensible `Cache-Control`. Catch unexpected
> errors and return a generic `500` without leaking internals. Export the response type so
> the frontend can share it. Don't touch the data model or any React components.

**Expected diff:** one new file, `src/app/api/products/search/route.ts`, plus perhaps a
shared response type.

```ts
// src/app/api/products/search/route.ts (illustrative)
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { searchProducts } from '@/app/lib/catalog';

const QuerySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).optional().default(5),
});

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = QuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
  }
  try {
    const { q, limit } = parsed.data;
    const results = searchProducts(q, limit);
    return NextResponse.json(
      { query: q, count: results.length, results },
      { headers: { 'Cache-Control': 'public, max-age=60' } },
    );
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### 4.3 Verify and commit

```bash
cd src && npm run build && npm run dev   # then, in another shell:
curl 'http://localhost:3000/api/products/search?q=paint&limit=3'
```

```bash
git add -A
git commit -m "Add validated GET /api/products/search route handler"
```

> **📸 Screenshot:** the `curl` response showing real grounded JSON results.

---

## Part 5 — Layer 3: wire the chat to the API

**Branch:** `feat/chat-grounding`  •  **Agent:** Frontend  •  **Base:** `feat/search-api`

### 5.1 Add the layer

```bash
gh stack add
# Name the branch:  feat/chat-grounding
```

### 5.2 Hand the work to the Frontend agent

> In `src/app/contexts/ChatContext.tsx`, replace the mock `generateAIResponse` with a real
> call to `GET /api/products/search`. When the user sends a message, fetch matching
> products and compose a grounded text answer that names real products and their formatted
> prices (e.g. "I found 3 interior paints under $70: …"). Handle the no-results case with an
> honest message, and handle fetch failure by surfacing the existing error state. Keep the
> reducer as the source of truth. This layer is **data flow only** — no new UI components
> yet; the assistant still replies with text.

**Expected diff:** focused edits to `src/app/contexts/ChatContext.tsx` (swap the random
generator for an `async` fetch + grounded formatting). No component files change yet.

### 5.3 Verify and commit

Open the chat and ask "show me interior paint". You should now get a **grounded** reply
that references real catalog products — still plain text.

```bash
git add -A
git commit -m "Ground chat responses in the product search API"
```

> Keeping wiring (this layer) separate from presentation (the next) is deliberate: a
> reviewer checking data flow shouldn't also have to review card markup, and vice-versa.

---

## Part 6 — Layer 4: grounded UI & citations

**Branch:** `feat/grounded-ui`  •  **Agent:** Frontend  •  **Base:** `feat/chat-grounding`

### 6.1 Add the top layer

```bash
gh stack add
# Name the branch:  feat/grounded-ui
```

### 6.2 Hand the work to the Frontend agent

> Add rich presentation for grounded answers. Extend the `Message` type in
> `src/app/types/chat.ts` with an optional `products` array (id, name, formatted price,
> image, link). In `ChatContext`, attach the products returned from the search API to the
> assistant message. Create a `ProductCard` component under
> `src/app/components/chat/` and render a compact citation card list beneath grounded
> replies in `ChatMessage.tsx`. Add a clear **empty state** ("no matching products") and
> ensure the **error state** renders gracefully. Use `next/image`, Tailwind (teal palette),
> semantic HTML, and accessible labels. Never `dangerouslySetInnerHTML` model text.

**Expected diff:** `src/app/types/chat.ts` (+`products`), `ChatContext.tsx` (attach
products), a new `ProductCard.tsx`, and `ChatMessage.tsx` (render cards + states).

### 6.3 Verify and commit

```bash
cd src && npm run lint && npx tsc --noEmit && npm run build
git add -A
git commit -m "Render grounded product citation cards with empty and error states"
```

> **📸 Screenshot:** the chat replying with product **cards** — your "after" shot, to sit
> next to the "before" from Part 0.

---

## Part 7 — Submit the stack

You now have four stacked branches locally. Push and open them as a linked stack:

```bash
gh stack push       # pushes every branch in the stack
gh stack submit     # creates/links the PRs with correct base branches
```

`gh stack submit` opens **four** PRs, each targeting the branch below it:

- PR #1 `feat/catalog-data` → `main`
- PR #2 `feat/search-api` → `feat/catalog-data`
- PR #3 `feat/chat-grounding` → `feat/search-api`
- PR #4 `feat/grounded-ui` → `feat/chat-grounding`

Check the whole stack at a glance:

```bash
gh stack status
```

> **📸 Screenshot:** `gh stack status` output showing all four branches, their PR links,
> and statuses.

### The stack map & CI on every layer

Open any PR on GitHub. At the top you'll see the **stack map** — every PR in the stack,
its status, and one-click navigation between layers. This is the reviewer's compass.

Two things to point out for your audience:

- **Rules on every layer.** Branch-protection rules (e.g. required reviews) are enforced
  against the **final target branch** (`main`) for *every* PR — even mid-stack PRs that
  directly target another branch.
- **CI on every layer.** Our `ci.yml` (Lint / Typecheck / Build) runs on all four PRs, as
  if each targeted `main`. Every layer must independently pass the same quality bar.

> **📸 Screenshot:** a PR page showing the **stack map** header and the three green CI
> checks. Capture this on a mid-stack PR (e.g. #3) to make the "rules on every layer" point
> land.

---

## Part 8 — Review as the human

This is the core Developer Experience payoff, and it's **your** job. Switch hats: the
agents authored the stack; you evaluate it.

### 8.1 Read top-down, review bottom-up

Use the stack map to **read from the top** for context ("ah, the end goal is product
cards"), then **review from the bottom up**, because each layer only makes sense once the
one below it is understood:

1. **PR #1 (catalog-data):** Are the types sound? Is the seed data validated by the schema?
   Is `searchProducts` free of ReDoS and bounded? *One concern, small diff, fast yes.*
2. **PR #2 (search-api):** Is input validated? Are error paths safe? Does it reuse the data
   layer rather than re-implementing it?
3. **PR #3 (chat-grounding):** Does the wiring handle no-results and fetch failure?
4. **PR #4 (grounded-ui):** Accessibility, empty/error states, no unsafe HTML.

Each PR is a **focused diff** — the thing that makes review actually feasible. Contrast
this with the single 600-line blob from Part 0: same code, radically different reviewability.

> **📸 Screenshot:** the focused "Files changed" tab of PR #1 — small and self-contained.

### 8.2 Request a change on a lower layer

Now demonstrate the human staying in the loop. Suppose on **PR #1** you decide the data
layer should reject malformed prices more strictly. Leave a review comment requesting the
change and mark **Request changes**.

> **📸 Screenshot:** your "Request changes" review on PR #1.

Hand the feedback back to the **Data Modeler** agent (it owns that branch). It amends
`feat/catalog-data` — for example, tightening the Zod schema so negative or non-integer
minor-unit prices fail validation — and re-pushes **that branch**.

This is the moment the stack earns its keep: a change to the **bottom** layer needs to flow
into the three layers built on top of it. That's Part 9.

---

## Part 9 — Cascading rebase

You changed `feat/catalog-data`. The three branches above it were built on the *old*
version and now need to be replayed on top of the new one. Without stacks this is the
tedious, error-prone part — rebase #2 onto #1, then #3 onto #2, then #4 onto #3, resolving
drift at each step.

With Stacked PRs it's **one action**:

```bash
gh stack rebase
```

…or click **Rebase Stack** in the PR UI to run the same **server-side cascading rebase**.
It replays the entire stack on top of the updated base, updates every unmarked branch, and
force-pushes the results. CI re-runs on each affected layer.

> **📸 Screenshot:** the **Rebase Stack** button in the PR UI, and/or `gh stack rebase`
> output showing all layers replayed.

> **Note on partial merges:** you don't have to rebase manually after merges either — when
> you merge the bottom PR, GitHub automatically rebases the remainder so the next PR
> re-targets `main`. Squash merges are handled safely too (the engine replays only your
> unique commits on top of the squashed base, avoiding phantom conflicts).

---

## Part 10 — Merge bottom-up

Stacks merge **from the bottom up** — a PR can merge once the PRs below it are merged (or
merge at the same time). Once your reviews are approved and CI is green across the stack:

- **Direct merge** — merging a PR lands it and any unmerged PRs below it in one operation,
  as long as all conditions are met. To land the whole feature, merge from PR #1 upward
  (or merge #4 directly and GitHub takes the layers below with it).
- **Merge queue** — works as usual but is **stack-aware**: pull the bottom PR from the
  queue and the rest come out too.
- **Merge multiple at once** — wait for CI on the specific layers you want (say the bottom
  two) and land them together in a single step.

Merge methods all work — **merge commit**, **squash**, or **rebase** — and the resulting
history is identical to merging each PR individually from the bottom. After a partial
merge, remaining PRs auto-rebase onto the updated `main`.

> **📸 Screenshot:** the stack merge box, and the final all-merged stack map (all layers
> purple/merged).

Pull `main`, run the app, open the chat, and ask about interior paint. The assistant now
answers from the **real catalog**, via the **real API**, rendered as **real product
cards** — delivered as four small PRs instead of one wall of diff.

---

## Part 11 — Recap & takeaways

### What you did

- Turned a mock assistant into a grounded one across a **4-layer stack**:
  data → API → wiring → UI.
- Watched **three custom agents** each own a focused workstream and produce
  independently reviewable layers.
- Played the **human reviewer**: navigated the stack map, reviewed focused diffs,
  requested a change on the bottom layer, triggered a **cascading rebase**, and merged
  **bottom-up** — with **CI and rules enforced on every layer**.

### The honest takeaway

Circle back to Part 0. Stacked PRs did **not** magically expand your review bandwidth, and
they did **not** replace your judgement — you still reviewed every layer and caught a real
issue in the data foundation. What they *did* do is give the agents a **native way to
decompose** a big change into small, ordered, reviewable pieces, so the review you have to
do is one you can *actually* do well.

Decomposition is the win. It's a mitigation for the oversized, low-context AI PR — not a
substitute for the human in the loop.

### When to reach for stacks with agents

- The change has a clear **dependency chain** (foundation → consumers).
- One agent PR would otherwise be **too big to review** in one sitting.
- Different pieces have **different reviewers** or risk profiles.
- You want to **land and de-risk foundations early** while higher layers iterate.

---

## Appendix — `gh stack` command cheat-sheet

| Command | What it does |
|---------|--------------|
| `gh extension install github/gh-stack` | Install the CLI extension |
| `gh skill install github/gh-stack` | Teach your AI agents to work with stacks |
| `gh stack init` | Start a stack; create the bottom branch off `main` |
| `gh stack add` | Add a new layer on top of the current branch |
| `gh stack push` | Push every branch in the stack |
| `gh stack submit` | Create/update PRs and link them as a stack |
| `gh stack status` | Show all branches, PR links, and statuses |
| `gh stack rebase` | Cascading rebase of the whole stack onto latest trunk |
| `gh stack up` / `down` / `top` / `bottom` | Navigate between layers |
| `gh stack sync` | Fetch, rebase, push, and re-link the stack in one go |
| `gh stack modify` | Interactively drop/fold/insert/rename/reorder layers |
| `gh stack checkout <pr>` | Pull a whole stack down from GitHub locally |
| `gh stack unstack` | Remove a stack from GitHub and local tracking |

> The CLI is optional — you can create and manage Stacked PRs from the GitHub UI, the API,
> or plain Git. The CLI just makes the local loop faster.

---

**Reference:** [Stacked PRs, native in GitHub](https://github.github.com/gh-stack/)
