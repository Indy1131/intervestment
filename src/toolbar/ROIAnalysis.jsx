import Line from "../components/Line";

export default function ROIAnalysis({ country, countries, structured }) {
  const incomeGroup = countries[country]["Income group"];

  const linreg = Object.keys(structured)
    .map((key) => {
      return { ...structured[key], country: key };
    })
    .sort((a, b) => a.spending - b.spending);

  let real = 0;
  const spend = linreg
    .map((val) => {
      if (val.country == country) {
        real = val.r2;
      }

      return { name: val.spending, value: val.r2 };
    })
    .filter((val) => val.value != 0 && val.value != 1);

  const incomeSpend = linreg
    .map((val) => {
      if (val.country == country) {
        real = val.r2;
      }

      let value = val.r2;

      if (
        !countries[val.country]["Income group"] ||
        countries[val.country]["Income group"] != incomeGroup
      ) {
        value = 0;
      }

      return { name: val.spending, value: value };
    })
    .filter((val) => val.value != 0 && val.value != 1);

  const predictedr2 =
    structured[country].spending * 1.7652516531122193e-11 + 0.512106184526206;

  const percent = (real - predictedr2) / predictedr2;

  const ROIScore = Math.min(
    Math.max(75 + (percent > 0 ? percent * 25 : percent * 75), 0),
    100
  ).toFixed(2);

  return (
    <>
      <h2 className="text-[40px]">ROI Analysis</h2>
      <h2 className="text-[20px] my-[10px]">
        Global Stability Scores vs Aid Spending
      </h2>
      <div className="backdrop">
        <Line
          data={[{ name: "spending", values: spend }]}
          yDomain={[0, 1]}
          showReg={true}
        />
      </div>
      <h2 className="text-[20px] my-[10px]">
        Income Group Stability Scores vs Aid Spending
      </h2>
      <div className="backdrop">
        <Line
          data={[{ name: "spending", values: incomeSpend }]}
          yDomain={[0, 1]}
          showReg={true}
        />
      </div>
      <h1 className="mt-[20px]">ROI Score</h1>
      <h1 className="text-green-400 text-[80px]">{ROIScore}</h1>
    </>
  );
}
