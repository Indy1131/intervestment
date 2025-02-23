const fs = require("fs").promises;

async function calculateROIs() {
  try {
    const data = JSON.parse(await fs.readFile("./data.json", "utf8"));
    const countries = data.countries;

    const structured = JSON.parse(
      await fs.readFile("./structured.json", "utf8")
    );
    const linreg = JSON.parse(await fs.readFile("./linreg.json", "utf8"));

    const ROIs = {};

    for (const country of Object.keys(countries)) {
      if (structured[country]) {
        let real = 0;
        const spend = linreg
          .map((val) => {
            if (val.country == country) {
              real = val.r2;
            }

            return { name: val.spending, value: val.r2 };
          })
          .filter((val) => val.value != 0 && val.value != 1);

        const predictedr2 =
          structured[country].spending * 1.7652516531122193e-11 +
          0.512106184526206;

        const percent = (real - predictedr2) / predictedr2;

        const ROIScore = Math.min(
          Math.max(75 + (percent > 0 ? percent * 25 : percent * 75), 0),
          100
        ).toFixed(2);

        ROIs[country] = ROIScore;
      }
    }

    await fs.writeFile("./ROIs.json", JSON.stringify(ROIs, null, 2));
    console.log("ROIs saved to ROIs.json");
  } catch (error) {
    console.error("Error calculating ROIs:", error);
  }
}

calculateROIs();
