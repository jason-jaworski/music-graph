# Music Graph

**An intelligent map of your musical life.**

Music Graph is an experimental personal music graph for people who care deeply about music. It combines intentional taste, listening behaviour, physical ownership and factual music knowledge to help a person understand what they know, what they are missing and which musical thread is worth following next.

The current prototype is deliberately single-user and deterministic. It is testing the question:

> Can a personal music graph tell one user something true, useful and non-obvious, and lead them somewhere genuinely worth exploring?

## Current status
The repository contains a synthetic collector dataset, a cached MusicBrainz graph, MusicBrainz enrichment scripts and a deterministic traversal/ranking proof.

The strongest proof so far starts with strong personal affinity for **The Jesus Lizard** and generically discovers **Scratch Acid** through two shared-member paths. Chronology and shared Austin origin make Scratch Acid rank above weaker related candidates. The target was planted as a test fixture but is not read by the discovery logic.

The immediate next milestone is GitHub issue #10: extend generic traversal to release-group nodes and recover:

```text
Talk Talk
→ Mark Hollis [artist]
→ Mark Hollis [release group]
```

without a hard-coded Talk Talk rule.

## Start here
If you are a developer or coding agent joining without previous chat context, read in this order:

1. [`docs/current-state.md`](docs/current-state.md) — exact restart point, proven behaviour and working rules.
2. [`docs/prototype-brief.md`](docs/prototype-brief.md) — product thesis, validation criterion and scope.
3. [`docs/architecture.md`](docs/architecture.md) — source-of-truth boundaries and technical architecture.
4. [`docs/graph-model.md`](docs/graph-model.md) — graph/entity model.
5. [`docs/insight-model.md`](docs/insight-model.md) — deterministic discovery and ranking model.
6. [`docs/data-and-fixtures.md`](docs/data-and-fixtures.md) — synthetic data and the critical fixture boundary.
7. [`docs/decisions.md`](docs/decisions.md) — durable product decisions and open questions.
8. [`docs/target-insights.md`](docs/target-insights.md) and [`docs/hidden-stories.md`](docs/hidden-stories.md) — evaluation targets, never recommendation inputs.

Then read the relevant open GitHub issue before changing code.

## Architecture in one view

```text
MusicBrainz graph
   ↓
canonical music knowledge
   ↓
local graph/cache
   +
user relationship layer
   ↓
own / heard / love / rating / listening / want
   ↓
insight engine
   ↓
"you should explore this, because…"
```

MusicBrainz tells us what is connected in the world. Music Graph decides which connections matter to this person.

## Repository map

```text
data/
  synthetic-collection.json   synthetic personal evidence + test fixtures
  musicbrainz-graph.json      cached factual graph used by the prototype

docs/
  current-state.md            restart/handover guide
  prototype-brief.md          product scope
  architecture.md             technical architecture
  graph-model.md              entity/relationship model
  insight-model.md            discovery/ranking approach
  data-and-fixtures.md        data boundaries
  decisions.md                durable decisions/open questions
  hidden-stories.md           planted evaluation stories
  target-insights.md          target insight behaviours
  schema-example.json         graph schema example

src/
  insights.js                 early deterministic insight harness
  graph-traverse.js           generic graph traversal/ranking
  musicbrainz/
    test-artist.js
    fetch-artist-relationships.js
    fetch-artist-release-groups.js
```

## Working principles
- Generic graph logic over artist-specific rules.
- Factual music relationships remain separate from personal state.
- Hidden-story fixtures must never drive discovery/scoring.
- Deterministic ranking before LLM-generated narrative.
- Preserve evidence paths so every insight can explain why it appeared.
- Validate single-user insight before social, marketplace or production integration work.

## Product sequence

```text
Me → My graph → My guide → Other people → Transactions / link-outs
```

The project is currently validating **Me → My graph → My guide**.
