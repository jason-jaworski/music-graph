# Music Graph Model

## Working principle
Represent music knowledge and the user's relationship to that knowledge separately.

## Candidate entities
- User
- Artist
- Artist alias / group
- Release group / album
- Physical release / pressing
- Recording / track
- Label
- Genre / style
- Scene / movement
- Contributor / person
- Role (producer, engineer, musician, composer, remixer)
- Event / gig
- List / collection

## Candidate user relationships
- Heard
- Love
- Like
- Know well
- Own
- Previously owned
- Want on vinyl
- Want to hear
- Want to explore
- Seen live
- Not interested
- Rated / reviewed

## Candidate music relationships
- Released by
- Member of
- Performed on
- Produced by
- Engineered by
- Collaborated with
- Alias of
- Scene association
- Same label
- Same era
- Same genre / style
- Contains / edition of

## Source strategy
The product owns the canonical graph. External services attach IDs and evidence to canonical entities.

Potential external identifiers include:
- MusicBrainz IDs
- Discogs artist / release IDs
- Spotify IDs
- Apple Music IDs

## MVP constraint
Only model relationships needed to support the first target insights. Prefer a narrow, deep sample over broad but shallow coverage.
