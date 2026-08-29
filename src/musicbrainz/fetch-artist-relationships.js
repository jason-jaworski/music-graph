const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const mbid = process.argv[2];

if (!mbid) {
  console.error(
    "Usage: node src/musicbrainz/fetch-artist-relationships.js <MBID>"
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

  const raw = fs.readFileSync(graphPath, "utf8").trim();

  if (!raw) {
    return { nodes: [], edges: [] };
  }

  return JSON.parse(raw);
}

function fetchArtist(mbid) {
  const url = new URL(
    `https://musicbrainz.org/ws/2/artist/${mbid}`
  );

  url.searchParams.set("inc", "artist-rels");
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

  if (!data.id || !data.name) {
    throw new Error(
      `Invalid MusicBrainz artist response: ${raw}`
    );
  }

  return data;
}

function edgeKey(edge) {
  return [
    edge.from,
    edge.to,
    edge.type,
    edge.direction
  ].join("|");
}

const artist = fetchArtist(mbid);
const graph = loadGraph();

const newNodes = [
  {
    id: artist.id,
    name: artist.name,
    type: "artist",
    artist_type: artist.type || null,
    country: artist.country || null,
    begin_year: artist["life-span"]?.begin || null,
    end_year: artist["life-span"]?.end || null,
    begin_area: artist["begin-area"]?.name || null
  }
];

const newEdges = [];

for (const relation of artist.relations || []) {
  if (!relation.artist) continue;

  newNodes.push({
    id: relation.artist.id,
    name: relation.artist.name,
    type: "artist"
  });

  newEdges.push({
    from: artist.id,
    from_name: artist.name,
    to: relation.artist.id,
    to_name: relation.artist.name,
    type: relation.type.replaceAll(" ", "_"),
    direction: relation.direction,
    attributes: relation.attributes || [],
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

console.log(`Fetched: ${artist.name}`);
console.log(`New relationships found: ${newEdges.length}`);
console.log(`Graph nodes: ${updatedGraph.nodes.length}`);
console.log(`Graph edges: ${updatedGraph.edges.length}`);