import Bar from "../components/Bar";
import Pie from "../components/Pie";

export default function DonorAnalysis({ country, countries }) {
  const donors = {};

  Object.keys(countries[country].years).map((year) => {
    if (year >= 2000 && countries[country].years[year].amount_per_org) {
      for (const orgType of Object.keys(
        countries[country].years[year].amount_per_org
      )) {
        if (!donors[orgType]) donors[orgType] = 0;
        donors[orgType] +=
          countries[country].years[year].amount_per_org[orgType];
      }
    }
  });

  let sum = 0;
  const donorData = Object.keys(donors).map((orgType) => {
    sum += donors[orgType];
    return { name: orgType, value: donors[orgType] };
  });

  const adjusted = donorData.map((val) => {
    return { name: val.name, value: val.value / sum * 100 };
  });

  console.log(adjusted);

  return (
    <>
      <h2 className="text-[40px]">Donor Analysis</h2>
      <h2 className="text-[20px] my-[10px]">Historical Donor Aggregate</h2>
      <div className="backdrop">
        <Bar data={donorData} height={300} width={700} />
      </div>
      <h2 className="text-[20px] my-[10px]">Recommended Donor Distribution</h2>
      <div className="backdrop">
        <Pie data={adjusted} height={250} width={300} />
      </div>
    </>
  );
}
