const graph = require("../data/musicbrainz-graph.json");

const collection = require("../data/synthetic-collection.json").collection;

function neighbours(nodeId) {
  const connected = new Map();

  for (const edge of graph.edges) {
    if (edge.from === nodeId) {
      connected.set(edge.to, {
        id: edge.to,
        name: edge.to_name,
        via: edge.type
      });
    }

    if (edge.to === nodeId) {
      connected.set(edge.from, {
        id: edge.from,
        name: edge.from_name,
        via: edge.type
      });
    }
  }

  return [...connected.values()];
}

function findNodeByName(name) {
  return graph.nodes.find(
    node => node.name.toLowerCase() === name.toLowerCase()
  );
}

function artistAffinity(artistName) {
  const releases = collection.filter(
    item => item.artist.toLowerCase() === artistName.toLowerCase()
  );

  let score = 0;

  for (const item of releases) {
    if (item.heard) score += 1;
    if (item.own) score += 2;
    if (item.love) score += 3;

    if (item.rating >= 4.5) score += 2;
    if (item.rating === 5) score += 1;

    if (item.listening === "high") score += 2;
    if (item.listening === "very_high") score += 3;
  }

  return score;
}

function relationshipScore(startId, viaId, targetId) {
  const firstEdge = graph.edges.find(
    edge =>
      (edge.from === startId && edge.to === viaId) ||
      (edge.to === startId && edge.from === viaId)
  );

  const secondEdge = graph.edges.find(
    edge =>
      (edge.from === viaId && edge.to === targetId) ||
      (edge.to === viaId && edge.from === targetId)
  );

  const startNode = graph.nodes.find(node => node.id === startId);
  const targetNode = graph.nodes.find(node => node.id === targetId);

  let score = 0;
  const reasons = [];

  if (firstEdge?.type === "member_of_band") {
    score += 2;
    reasons.push("source_to_member");
  }

  if (secondEdge?.type === "member_of_band") {
    score += 2;
    reasons.push("member_to_target_band");
  }

  const startYear = parseInt(startNode?.begin_year, 10);
  const targetYear = parseInt(targetNode?.begin_year, 10);

  const sameOrigin =
    startNode?.begin_area &&
    targetNode?.begin_area &&
    startNode.begin_area === targetNode.begin_area;

  if (
    Number.isFinite(startYear) &&
    Number.isFinite(targetYear) &&
    targetYear < startYear &&
    sameOrigin
  ) {
    score += 3;
    reasons.push("same_origin_precursor");
  }

  return {
    score,
    reasons
  };
}


function twoHopArtists(startName) {
  const start = findNodeByName(startName);
  const affinity = artistAffinity(startName);

  if (!start) {
    throw new Error(`Artist not found: ${startName}`);
  }

  const firstHop = neighbours(start.id);
  const candidates = new Map();

  for (const middle of firstHop) {
    for (const target of neighbours(middle.id)) {
      if (target.id === start.id) continue;

      const relationship = relationshipScore(
  start.id,
  middle.id,
  target.id
);

const relationshipScoreValue = relationship.score;

      if (!candidates.has(target.id)) {
        candidates.set(target.id, {
          start: start.name,
          target: target.name,
          affinity,
          relationship_score: relationshipScoreValue,
          paths: [],
          score: affinity + relationshipScoreValue
        });
      }

      const candidate = candidates.get(target.id);

   candidate.paths.push({
  via: middle.name,
  relationship_score: relationshipScoreValue,
  reasons: relationship.reasons
});

      candidate.relationship_score = Math.max(
        candidate.relationship_score,
        relationshipScoreValue
      );

      candidate.score =
        candidate.affinity +
        candidate.relationship_score;
    }
  }

  const knownArtists = new Set(
    collection.map(item => item.artist.toLowerCase())
  );

return [...candidates.values()]
  .filter(
    result => !knownArtists.has(result.target.toLowerCase())
  )
  .sort((a, b) => b.score - a.score);
}

const startArtist = process.argv.slice(2).join(" ");

if (!startArtist) {
  console.error(
    'Usage: node src/graph-traverse.js "Artist Name"'
  );
  process.exit(1);
}

console.log(
  JSON.stringify(twoHopArtists(startArtist), null, 2)
);