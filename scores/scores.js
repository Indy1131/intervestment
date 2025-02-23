const fs = require("fs").promises;

async function calculateScores() {
  try {
    const data = JSON.parse(await fs.readFile("./fits.json", "utf8"));

    const values = Object.values(data);
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;

    const scores = {};

    for (const [country, real] of Object.entries(data)) {
      const percent = (real - mean) / mean;

      const finalScore = Math.max(
        0,
        Math.min(real > 0 ? 25 * percent + 75 : 75 * percent + 75, 100)
      );

      scores[country] = finalScore.toFixed(2);
    }

    await fs.writeFile("./scores.json", JSON.stringify(scores, null, 2));
    console.log("Scores saved to scores.json");
  } catch (error) {
    console.error("Error calculating scores:", error);
  }
}

calculateScores();
