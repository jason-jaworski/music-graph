# Decisions

## Product decisions
- Not vinyl-only.
- Not a Discogs clone.
- Not simply a Letterboxd-for-music ratings app.
- Initial wedge is single-user music intelligence, not social or commerce.
- Visible proposition: a home for people who really care about music.
- The product owns the canonical personal graph; third parties contribute evidence/enrichment.
- Agents sit behind the scenes rather than appearing as named assistants or control panels.
- Optimise for learning, curiosity and depth rather than transaction volume or time-on-app.
- Social features must be additive; the product should be useful for one person first.
- Explicit taste should be distinguished from passive listening behaviour.
- Marketplace, payments and dealer features are parked until the core insight proposition is proven.
- Build sequence: Me → My graph → My guide → Other people → Transactions/link-outs.

## Architecture decisions
- MusicBrainz is the first canonical external music knowledge graph beneath the personal graph.
- Cache a normalized factual graph locally; do not depend on live API traversal for every insight.
- Keep canonical music knowledge separate from personal state.
- Keep album/release-group taste separate from physical pressing ownership.
- Derived concepts such as precursor, same geography or similarity may be calculated from factual metadata rather than stored as invented canonical edges.
- Add MusicBrainz entity/relationship types incrementally when a target insight needs them.
- Current system-curl MusicBrainz access is an acceptable prototype workaround for the local Node certificate-chain issue; do not disable TLS verification.

## Insight/testing decisions
- Deterministic discovery and ranking comes before LLM narrative generation.
- Prefer generic graph traversal/scoring over artist-specific recommendation rules.
- Every ranked candidate should preserve enough evidence to explain why it appeared.
- Multiple factual paths should be preserved as corroborating evidence; they do not automatically multiply score at this stage.
- Synthetic personal behaviour is acceptable for validation; underlying music relationships should remain factual.
- `deliberate_gaps`, hidden stories and target insights are evaluation fixtures only and must never be recommendation inputs.
- The committed local MusicBrainz graph is intentional during the prototype so tests can be reproducible.

## Source-of-truth decisions
- GitHub is the implementation source of truth: code, durable technical/product constraints, issues, tests and current implementation state.
- The dedicated ChatGPT project is the working reasoning environment around the repository.
- Notion may hold higher-level research/product material, but should not become a competing implementation state tracker.
- The repository should contain enough context that a competent developer or coding agent can continue without access to the originating chat history.

## Open questions
- What is the minimum viable graph schema beyond the current proof?
- How should heard, liked, loved, know-well and inferred-listening differ in a production personal model?
- What makes a catalogue gap meaningful rather than merely absent?
- Which additional relationship types are reliable enough to power recommendations?
- When should corroborating paths affect confidence/score rather than explanation only?
- How should graph exploration avoid becoming a generic node-link visualisation?
- How much human curation should shape the graph and recommendations?
- How should physical pressings sit beneath album/release-group level cultural objects?
- Which personal data integrations are worth adding after the deterministic insight proposition is proven?
