import Bar from "../components/Bar";

export default function FitAnalysis({
  country,
  fitScores,
  fits,
  inputs,
}) {
  const current = inputs[country];
  const currInputs = Object.keys(current).map((key) => {
    return { name: key, value: current[key] };
  });

  return (
    <>
      <h2 className="text-[40px]">Fit Analysis</h2>
      <h2 className="text-[20px] my-[10px]">Normalized Input Metrics</h2>
      <div className="backdrop">
        <Bar data={currInputs} width={700} height={300} />
      </div>
      <h2 className="text-[#A371F7] text-[30px] mt-[10px]">
        Predicted {Math.max(Math.min((fits[country] * 10).toFixed(2), 100), 0)}% of the total
        budget spent on aid
      </h2>
      <h1 className="mt-[20px]">Fit Score</h1>
      <h1 className="text-green-400 text-[80px]">{fitScores[country]}</h1>
    </>
  );
}
