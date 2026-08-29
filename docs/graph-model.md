# Minimum Viable Music Graph

## Purpose
This schema exists only to support the first five prototype behaviours:

1. Do I own this?
2. What am I missing from this artist?
3. What thread should I follow next?
4. What obscure record should I investigate?
5. What does my collection say about my taste that I have not noticed?

The graph should represent **music knowledge** separately from **the user's relationship to that knowledge**.

---

## Core entity types

### 1. Artist
A performing identity: solo artist, band, ensemble or named project.

Minimum fields:
- `id`
- `name`
- `type` — person | group | project
- `external_ids` — MusicBrainz, Discogs, Spotify, Apple Music where available

Examples: The Jesus Lizard, Fugazi, Sunn O))), Mark Hollis.

### 2. Release Group
The culturally meaningful work-level object used for listening, ratings and catalogue completeness. Usually an album, EP, single or compilation independent of a specific pressing.

Minimum fields:
- `id`
- `title`
- `primary_artist_id`
- `type` — album | ep | single | compilation | live | other
- `first_release_year`
- `external_ids`

Examples: `Goat`, `Repeater`, `Spirit of Eden`.

### 3. Physical Release
A specific edition/pressing of a release group. Only required where ownership or duplicate prevention matters.

Minimum fields:
- `id`
- `release_group_id`
- `format`
- `country`
- `year`
- `label_id`
- `catalogue_number`
- `barcode`
- `external_ids`

This distinction lets the product say: "You own this album, but not this pressing."

### 4. Contributor
A real person who can connect otherwise separate music: producer, engineer, musician, composer, remixer, etc.

Minimum fields:
- `id`
- `name`
- `external_ids`

Examples: Steve Albini, David Yow, David Wm. Sims.

### 5. Label
A record label used for catalogue context, collecting patterns and exploration threads.

Minimum fields:
- `id`
- `name`
- `external_ids`

Examples: Touch and Go, Dischord, Drag City.

### 6. Tag
A deliberately lightweight descriptor for genre, style, scene or movement.

Minimum fields:
- `id`
- `name`
- `type` — genre | style | scene | movement

Examples: noise rock, post-hardcore, Louisville, spiritual jazz.

Tags are evidence, not a rigid taxonomy. The prototype should tolerate overlap and ambiguity.

---

## Music knowledge edges

Store only relationships that carry meaning independently of the user.

- `artist -> release_group` : `primary_artist`
- `release_group -> label` : `released_by`
- `release_group -> contributor` : `contributed_to` with `role`
- `artist -> contributor` : `member_identity` where useful for former/current band membership
- `artist -> artist` : `related_artist` only for explicit relationships such as member-of, alias-of or collaboration
- `artist|release_group -> tag` : `tagged_as`
- `physical_release -> release_group` : `edition_of`

Do **not** persist inferred edges such as `same_genre`, `same_era`, `similar_artist` or `might_like`. Those should be derived during insight generation from shared evidence.

---

## User relationship state

The user relationship is stored separately from music metadata. One user can have multiple states toward the same entity.

### Release-group state
Minimum fields:
- `user_id`
- `release_group_id`
- `heard` — boolean
- `love` — boolean
- `rating` — optional 0.5–5
- `know_well` — boolean
- `want_to_hear` — boolean
- `want_on_vinyl` — boolean
- `not_interested` — boolean
- `declared_at` — optional timestamp

### Ownership state
Minimum fields:
- `user_id`
- `physical_release_id`
- `owned` — boolean
- `previously_owned` — boolean
- `acquired_at` — optional timestamp

### Artist state
Minimum fields:
- `user_id`
- `artist_id`
- `love` — boolean
- `want_to_explore` — boolean
- `know_well` — boolean

---

## Observed listening evidence

Passive behaviour must not be treated as equivalent to declared taste.

Store listening as evidence rather than a relationship like `love`.

Minimum fields:
- `user_id`
- `release_group_id`
- `source` — apple_music | spotify | lastfm | synthetic | other
- `play_count` — optional
- `recent_play_count` — optional
- `last_played_at` — optional
- `listening_strength` — optional prototype convenience value: low | medium | high | very_high

Rules:
- a high play count can increase confidence that an artist matters
- it must never silently set `love=true`
- explicit ratings/love signals outrank passive listening when they disagree

---

## Source evidence

Every canonical entity may carry multiple source identifiers.

Example:

```json
{
  "musicbrainz": "...",
  "discogs": "...",
  "spotify": "...",
  "apple_music": "..."
}
```

Canonical entities belong to the product. External services supply identifiers, metadata and evidence rather than defining the internal model.

---

## How the schema supports the first five behaviours

### Do I own this?
Requires `release_group`, `physical_release`, `edition_of` and ownership state.

### What am I missing from this artist?
Requires artist catalogue membership plus user release-group state. "Missing" is not enough: ranking should use release importance and strength of the user's relationship to the artist.

### What thread should I follow next?
Requires explicit graph edges through contributors, members, labels and tags, plus user taste evidence to rank which thread is personally meaningful.

### What obscure record should I investigate?
Requires a candidate release not yet heard plus multiple strong paths back into loved/known music. Obscurity itself can be mocked or added later; graph connectedness is the first test.

### What does my collection say about my taste that I have not noticed?
Requires aggregation over labels, tags, contributors and eras derived from owned/loved/heard releases. The insight engine should compare observed concentration with explicit user state and surface only unusually strong patterns.

---

## Deliberately out of scope for the first validation

Do not model these yet unless an insight genuinely requires them:
- individual tracks / recordings
- gigs and venues
- lists and reviews as first-class entities
- social users / follows
- comments and activity feeds
- marketplace listings
- prices and valuations
- detailed rights/credits ontology
- comprehensive geographic entities
- recommendation embeddings
- formal graph database technology

The first implementation can live comfortably in JSON or relational Postgres tables. "Graph" describes the domain model and traversal behaviour; it does not imply Neo4j or another graph database.

---

## Validation rule

A field or relationship only earns a place in the MVP schema if it helps generate or explain one of the target insights. Otherwise it stays parked.
