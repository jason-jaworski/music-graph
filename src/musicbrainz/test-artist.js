const { execFileSync } = require("child_process");

const artistName = process.argv.slice(2).join(" ");

if (!artistName) {
  console.error(
    'Usage: node src/musicbrainz/test-artist.js "Artist Name"'
  );
  process.exit(1);
}

const url = new URL(
  "https://musicbrainz.org/ws/2/artist"
);

url.searchParams.set(
  "query",
  artistName
);

url.searchParams.set("fmt", "json");

const raw = execFileSync(
  "curl",
  [
    "-sS",
    "-A",
    "music-graph-prototype/0.1 (https://github.com/jason-jaworski/music-graph)",
    url.toString()
  ],
  { encoding: "utf8" }
);

const data = JSON.parse(raw);

console.log(`Search results for: ${artistName}`);
console.log("---------------------------");

for (const artist of (data.artists || []).slice(0, 5)) {
  console.log({
    name: artist.name,
    mbid: artist.id,
    type: artist.type,
    country: artist.country,
    score: artist.score
  });
}