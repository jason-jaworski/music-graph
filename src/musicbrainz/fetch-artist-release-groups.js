const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const mbid = process.argv[2];

if (!mbid) {
  console.error(
    "Usage: node src/musicbrainz/fetch-artist-release-groups.js <ARTIST_Mbid>"
  );
  process.exit(1);
}

const graphPath = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "musicbrainz-graph.json"
);

function loadGraph() {
  if (!fs.existsSync(graphPath)) {
    return { nodes: [], edges: [] };
  }

  return JSON.parse(fs.readFileSync(graphPath, "utf8"));
}

function fetchReleaseGroups(artistMbid) {
  const url = new URL(
    "https://musicbrainz.org/ws/2/release-group"
  );

  url.searchParams.set("artist", artistMbid);
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

  return JSON.parse(raw);
}

function edgeKey(edge) {
  return [
    edge.from,
    edge.to,
    edge.type
  ].join("|");
}

const graph = loadGraph();
const artist = graph.nodes.find(node => node.id === mbid);

if (!artist) {
  throw new Error(
    `Artist ${mbid} is not in the local graph`
  );
}

const data = fetchReleaseGroups(mbid);
const newNodes = [];
const newEdges = [];

for (const releaseGroup of data["release-groups"] || []) {
  newNodes.push({
    id: releaseGroup.id,
    name: releaseGroup.title,
    type: "release_group",
    primary_type: releaseGroup["primary-type"] || null,
    first_release_date:
      releaseGroup["first-release-date"] || null
  });

  newEdges.push({
    from: artist.id,
    from_name: artist.name,
    to: releaseGroup.id,
    to_name: releaseGroup.title,
    type: "artist_release_group",
    direction: "forward",
    source: "musicbrainz"
  });
}

const nodesById = new Map();

for (const node of [...graph.nodes, ...newNodes]) {
  nodesById.set(node.id, node);
}

const edgesByKey = new Map();

for (const edge of [...graph.edges, ...newEdges]) {
  edgesByKey.set(edgeKey(edge), edge);
}

const updatedGraph = {
  updated_at: new Date().toISOString(),
  nodes: [...nodesById.values()],
  edges: [...edgesByKey.values()]
};

fs.writeFileSync(
  graphPath,
  JSON.stringify(updatedGraph, null, 2)
);

console.log(`Fetched release groups for: ${artist.name}`);
console.log(`Release groups found: ${newNodes.length}`);
console.log(`Graph nodes: ${updatedGraph.nodes.length}`);
console.log(`Graph edges: ${updatedGraph.edges.length}`);