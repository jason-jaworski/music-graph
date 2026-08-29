# Data and Test Fixtures

## Why synthetic data first
The prototype uses a synthetic-but-believable collector rather than depending on production access to a real personal music account. This makes the insight problem testable before integration work and allows known hidden stories to be planted deliberately.

The synthetic taste neighbourhood is inspired by music such as Big Black, The Jesus Lizard, Fugazi, Daniel Johnston, Sunn O))), Jonathan Richman, The Fall and adjacent scenes. Personal behaviour is fictional; underlying music relationships should be factual.

## Dataset
`data/synthetic-collection.json` contains:
- `profile`
- `collection`
- `deliberate_gaps`

The collection currently contains 64 releases.

Personal records can include fields such as:
- artist
- release
- year
- own
- heard
- love
- rating
- listening

This is prototype evidence, not the final schema.

## Deliberate gaps
The current planted gaps are:
- Scratch Acid — The Greatest Gift (`jesus-lizard-prehistory`)
- Rites of Spring — Rites of Spring (`dischord-gap`)
- Embrace — Embrace (`dischord-gap`)
- Mark Hollis — Mark Hollis (`talk-talk-branch`)
- The Pop Group — Y (`post-punk-blind-spot`)
- The Raincoats — The Raincoats (`post-punk-blind-spot`)
- Khanate — Khanate (`drone-branch`)
- Rhys Chatham — Die Donnergötter (`guitar-minimalism`)

See `hidden-stories.md` and `target-insights.md` for the intended evaluation stories.

## Hidden-story priorities
High-confidence stories include:
- Jesus Lizard prehistory → Scratch Acid
- Dischord gaps → Rites of Spring / Embrace
- Albini recording/production network, once contributor edges are verified
- Talk Talk branch → Mark Hollis

Medium-confidence stories include:
- post-punk blind spot → The Pop Group / The Raincoats
- drone branch → Khanate
- guitar minimalism → Rhys Chatham

Weak/plausible signals such as Mission of Burma, Faust and Neurosis are useful as ranking controls: they should not automatically outrank better-supported candidates merely because they are stylistically plausible.

## Critical fixture rule
`deliberate_gaps`, hidden-story IDs and target-insight documentation are evaluation fixtures only.

Discovery and scoring code must not inspect them.

Correct flow:

```text
personal collection evidence
+
factual cached music graph
→ discovery / scoring
→ ranked candidates
→ compare result against expected fixtures
```

Incorrect flow:

```text
deliberate_gaps
→ recommendation
```

## Factual vs synthetic data
The project deliberately mixes two kinds of data with a clear boundary:

### Synthetic
- ownership
- listening intensity
- ratings
- love/heard state
- deliberate omissions

### Factual
- artist identities / MBIDs
- release-group identities
- membership relationships
- dates
- origin areas
- later: contributors, labels, recordings and other MusicBrainz relationships

Do not invent factual graph edges to make a planted story pass. If MusicBrainz cannot support a desired story, either find another factual source or record that the hypothesis is unsupported.

## Why commit the cached graph
`data/musicbrainz-graph.json` is intentionally versioned during the prototype. It makes the current insight proof deterministic and inspectable and avoids depending on transient API behaviour for every test run.

This decision can be revisited once ingestion/storage becomes a product concern.
