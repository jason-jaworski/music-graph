# Architecture

## Purpose
This document captures the durable technical shape of the prototype. It should be enough for a developer or coding agent to understand the system without access to the conversations that created it.

## Core architecture

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

MusicBrainz tells us what is connected in the world. Music Graph decides which of those connections matter to this person.

## Source-of-truth boundaries

### External factual music knowledge
MusicBrainz is the first canonical external music knowledge graph. It supplies factual entities and relationships such as artists, release groups, releases, members and eventually contributors and labels.

The prototype caches a normalized subset locally in `data/musicbrainz-graph.json`. Insight generation should operate over this local graph rather than making live API calls during every traversal.

### Personal graph
Music Graph owns the personal relationship layer. Third-party services contribute evidence; they do not define the user's canonical musical identity.

Personal state includes concepts such as:
- own
- heard
- love
- rating
- listening intensity
- want / investigate later

Explicit taste and passive listening behaviour should remain distinguishable.

### Physical ownership vs musical work
Album/release-group level taste and physical pressing ownership are different concepts. A person can love an album without owning a copy, and can own a particular pressing without that pressing being the primary unit of taste.

## Initial entity model
The useful core entities are:
- Artist
- Release Group
- Physical Release
- Contributor
- Label
- Tag

See `graph-model.md` for the fuller model and `schema-example.json` for an example representation.

## Insight engine
The insight engine should be deterministic first. It combines:
1. strength of personal affinity for a known artist/release/area;
2. factual graph paths from MusicBrainz;
3. useful relationship signals such as shared members, chronology and geography;
4. filtering of already-known artists/releases;
5. ranking and preservation of explainable evidence paths.

An LLM may later turn structured evidence into good prose, but it must not be required to discover or rank the core candidate.

## Current MusicBrainz integration
The current scripts use macOS system `curl` from Node via `child_process.execFileSync`. This is a deliberate prototype workaround because local Node `fetch` encountered `SELF_SIGNED_CERT_IN_CHAIN` while system curl used the machine certificate store successfully.

Do not disable TLS verification. Refactor request handling into a reusable client later rather than blocking insight validation on the local certificate issue.

MusicBrainz requests should identify the application with a User-Agent and respect the public API rate limit. The current prototype should stay at or below roughly one request per second.

## Relationship coverage
Artist-to-artist membership relationships are the first proof, not the complete graph.

Producer, engineer, label, recording and other culturally interesting threads will require relationships attached to release groups, releases, recordings, works, labels or contributors because MusicBrainz stores relationships at the most specific relevant entity level.

Add these incrementally only when a target insight requires them.

## Integration posture
Do not build five production integrations before validating the insight proposition.

Likely future inputs include:
- MusicBrainz: canonical factual music knowledge.
- Apple Music: authorised personal library/listening evidence.
- User-provided collection data or exports: physical ownership.
- Discogs: potentially useful collection/pressing data, subject to verifying current terms before implementation.
- Spotify: useful enrichment but should not be a hard architectural dependency.
- Bandcamp: useful cultural context, but no clean general-purpose fan collection API should be assumed.

## Product/technical boundary
Agents are infrastructure, not the visible product proposition. They may later fetch, reconcile, enrich and explain graph data, but the user-facing experience should feel like an intelligent music product rather than a control panel for named agents.
