const fs = require("fs");
const path = require("path");

const datasetPath = path.join(
  __dirname,
  "..",
  "data",
  "synthetic-collection.json"
);

const data = JSON.parse(fs.readFileSync(datasetPath, "utf8"));

function getArtistEvidence(artistName) {
  return data.collection.filter(
    (item) => item.artist === artistName
  );
}

function scoreArtistAffinity(releases) {
  let score = 0;

  for (const release of releases) {
    if (release.heard) score += 1;
    if (release.own) score += 2;
    if (release.love) score += 3;

    if (release.rating >= 4.5) score += 2;
    if (release.rating === 5) score += 1;

    if (release.listening === "high") score += 2;
    if (release.listening === "very_high") score += 3;
  }

  return score;
}

function buildTalkTalkInsight() {
  const evidence = getArtistEvidence("Talk Talk");

  const gap = data.deliberate_gaps.find(
    (item) => item.story === "talk-talk-branch"
  );

  if (!gap || evidence.length === 0) {
    return null;
  }

  const score = scoreArtistAffinity(evidence);

  return {
    type: "catalogue_gap",
    subject: `${gap.artist} — ${gap.release}`,
    score,
    confidence: score >= 20 ? "high" : "medium",
    evidence: evidence.map((release) => ({
      artist: release.artist,
      release: release.release,
      own: release.own,
      love: release.love,
      rating: release.rating,
      listening: release.listening
    })),
    reason: gap.reason,
    suggested_action: "listen"
  };
}

const insight = buildTalkTalkInsight();

console.log(
  JSON.stringify(insight, null, 2)
);