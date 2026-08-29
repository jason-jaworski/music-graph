# Insight Model

## Prototype question
Can a personal music graph tell one user something true, useful and non-obvious, then lead them somewhere genuinely worth exploring?

The prototype is not trying to prove that a generic recommender can name plausible music. It is trying to prove that a graph combining personal evidence with factual music relationships can produce discoveries with an intelligible reason.

## Core behaviours
The insight layer should eventually answer questions such as:
- Do I own this?
- What am I missing from this artist?
- What thread should I follow next?
- What obscure record should I investigate?
- What does my collection say about my taste that I have not noticed?

## Personal affinity
The current harness calculates artist affinity from the synthetic collection. The current scoring proof awards weight for signals including:
- heard
- own
- love
- high ratings
- high or very high listening intensity

This is intentionally simple and deterministic. The exact weights are provisional; the important design principle is that a graph relationship becomes more relevant when it begins from something the person demonstrably cares about.

## Relationship evidence
Candidate discovery traverses factual graph edges. Relationship evidence is scored separately from personal affinity and should preserve reasons that can be inspected later.

The current proof includes:
- source → member relationship;
- member → target band relationship;
- a stronger `same_origin_precursor` signal when the target predates the source and both originate in the same area.

Derived concepts such as precursor, same era or same geography can be calculated from factual metadata rather than stored as invented canonical edges.

## Multiple paths
A candidate may be supported by more than one independent path. Preserve all useful paths as evidence and deduplicate the candidate itself.

At the current stage, multiple paths do not automatically add more score. This avoids accidentally inflating a candidate before the weighting model is understood. They can later become a confidence signal if testing supports it.

## First successful generic proof
The synthetic collector has strong affinity for The Jesus Lizard. Generic two-hop traversal over MusicBrainz data recovered Scratch Acid through two independent shared-member paths:

```text
The Jesus Lizard
  → David Yow
  → Scratch Acid

The Jesus Lizard
  → David Sims
  → Scratch Acid
```

Scratch Acid also predates The Jesus Lizard and shares Austin as its origin area. That combination gives it a stronger relationship score than alternatives such as Flipper, Pigface and Qui.

In the current proof, The Jesus Lizard affinity is 23; Scratch Acid receives relationship score 7 for a total of 30, while the weaker alternatives receive relationship score 4 for totals of 27.

This is important because Scratch Acid is one of the deliberately planted hidden stories, but the discovery logic did not read that fixture.

## Current boundary exposed by Talk Talk
The synthetic collector has very strong Talk Talk signals. Artist-to-artist traversal can reach Mark Hollis, but the desired target is the solo album `Mark Hollis`, which is a MusicBrainz release group rather than another artist.

MusicBrainz confirms the path:

```text
Talk Talk
  → Mark Hollis [artist]
  → Mark Hollis [release group, Album, first released 1998-02-02]
```

The local graph now contains that release-group node and edge. The traversal/ranking code does not yet treat release groups as candidate targets.

This is the immediate next model test.

## Test-fixture rule
`deliberate_gaps` and the hidden-story documentation are expected outcomes/test fixtures. They must never be read by discovery or scoring logic.

The system should discover planted stories from factual graph evidence plus personal-state evidence. Tests may compare outputs against the fixtures after discovery.

## Determinism before narrative
For the current phase, a useful insight should be representable as structured data containing at least:
- candidate/subject;
- insight type;
- personal affinity evidence;
- factual relationship path(s);
- score and/or confidence inputs;
- explanation reasons;
- suggested next action where useful.

Only after this is reliable should an LLM be introduced to phrase the explanation conversationally.

## Near-term evaluation
A good next test suite should establish that:
1. planted strong stories are recovered;
2. known artists/releases are filtered appropriately;
3. stronger multi-signal relationships outrank plausible red herrings;
4. results are stable across repeated runs over the same local graph;
5. every recommendation can explain why it appeared.
