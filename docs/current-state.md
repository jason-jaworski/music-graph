# Current State / Start Here

_Last updated: 29 August 2026._

Use this page as the restart point for a developer or coding agent joining the project without the originating chat history.

## What exists
Music Graph is currently a lightweight Node prototype, not yet a web application.

The repository contains:
- a synthetic but believable personal collection in `data/synthetic-collection.json`;
- a cached factual MusicBrainz graph in `data/musicbrainz-graph.json`;
- a deterministic insight harness in `src/insights.js`;
- generic graph traversal/ranking in `src/graph-traverse.js`;
- MusicBrainz artist search and graph-enrichment scripts under `src/musicbrainz/`;
- product, graph and target-insight documentation under `docs/`.

## What has been proved

### 1. Synthetic personal evidence can drive affinity
The collection contains 64 releases and deliberate hidden stories. Personal state such as ownership, listening, love and rating can be converted into a simple deterministic affinity score.

### 2. MusicBrainz can provide factual traversal edges
The local graph has been enriched from MusicBrainz with artist membership relationships and basic chronology/geography metadata.

### 3. A planted story can be recovered without hard-coding
For The Jesus Lizard, generic traversal discovers Scratch Acid via both David Yow and David Sims. Chronology + shared Austin origin strengthen the candidate, causing it to rank above weaker related bands.

This is the strongest proof so far that the product thesis is technically interesting rather than just a generic recommendation UI.

### 4. Release groups can be fetched
The Mark Hollis MusicBrainz artist node has been enriched with its solo `Mark Hollis` release group. The node is in the local graph, but generic traversal does not yet rank release-group targets.

## Immediate milestone
Implement issue #10: support release-group nodes in generic traversal and test whether the system can recover:

```text
Talk Talk
→ Mark Hollis [artist]
→ Mark Hollis [release group]
```

without a Talk Talk-specific rule and without reading the planted hidden-story fixtures.

Do not move on to UI work or production integrations until this proof is understood.

## Preserve existing proof
Changes to traversal should not regress:

```text
The Jesus Lizard
→ David Yow / David Sims
→ Scratch Acid
```

Scratch Acid should remain a stronger candidate than the current weaker two-hop alternatives because it has the additional same-origin precursor evidence.

## Current technical constraints
- Node `fetch` on the development machine encountered `SELF_SIGNED_CERT_IN_CHAIN`.
- Current MusicBrainz scripts therefore call system `curl` with TLS verification intact.
- MusicBrainz can transiently return a busy-server error; treat that as retryable external behaviour, not automatically as a code failure.
- Keep public API traffic conservative (roughly <=1 request/second).
- `data/musicbrainz-graph.json` is committed intentionally so the prototype's graph proof is reproducible.

## Working rules
1. Read the repository/docs and relevant GitHub issue before implementing.
2. Make small testable changes.
3. Prefer generic graph logic over artist-specific rules.
4. Keep factual music knowledge separate from personal state.
5. Never use hidden-story fixtures as recommendation inputs.
6. Keep ranking deterministic until it is demonstrably useful.
7. Preserve explainable paths/reasons with every candidate.
8. Commit at meaningful checkpoints and keep `main` recoverable.
9. Add new entity/relationship types only when a target insight needs them.
10. Avoid marketplace/social/production-integration work until the single-user insight proposition is validated.

## Product sequence
The intended progression is:

```text
Me
→ My graph
→ My guide
→ Other people
→ Transactions / link-outs
```

The prototype is still in `Me → My graph → My guide`.

## Source-of-truth split
- GitHub: implementation, durable architecture/product constraints, executable tests, issues and current technical state.
- ChatGPT project: active reasoning, exploration and working discussion around the repository.
- Notion: optional higher-level product/research archive; it should not contradict GitHub implementation state.

The goal is that this repository is sufficient to restart implementation even if no prior chat context is available.
