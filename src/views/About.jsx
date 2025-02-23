import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="w-[100vw] flex flex-col items-center">
      <h1 className="text-[70px] text-[#A371F7]">Intervestment.tech</h1>
      <h1 className="text-[30px] w-[700px] mt-[40px]">Problem Statement</h1>
      <div className="w-[700px] mb-[40px]">
        <p>
          There's a growing need for a more objective and effective way to
          analyze U.S. foreign aid. Policymakers often lack the tools to truly
          assess the impact and ROI of foreign aid, relying on data that is
          sometimes fragmented or subject to political bias. In a climate where
          aid funding, particularly from USAID, is being defunded and
          scrutinized, there’s an urgent need for a data-driven approach that
          transcends political agendas to ensure aid reaches those who need it
          most.
        </p>
      </div>
      <h2 className="text-[50px]">Who are we?</h2>
      <div className="backdrop w-[700px] mt-[30px] box-border p-[20px]">
        <h1 className="text-[15px] text-[#9198A1]">
          A tool to empower policymakers and citizens to understand the global
          impact of U.S. foreign aid, viewed through the lens of financial
          investment, in an era of rising debate over its allocation.
        </h1>
      </div>
      <h2 className="text-[50px] mt-[10px]">What can we do?</h2>
      <div className="backdrop mb-[50px] w-[700px] mt-[30px] box-border p-[40px] flex flex-col gap-[15px] text-[#9198A1]">
        <h1>We provide a way to visualize data.</h1>
        <ul className="flex flex-col gap-[10px] list-disc">
          <li>
            We detail the distribution of global statistics and U.S. foreign aid
            spending patterns over time.
          </li>
          <li>
            We analyze the latest national data, generating a Return on
            Investment (ROI) score to reflect a nation's improvement relative to
            aid received
          </li>
          <li>
            We generate Fit score to measure alignment with historical spending
            patterns using deep learning
          </li>
          <li>
            We create an aggregate score to determine a nation’s priority for
            additional funding.
          </li>
        </ul>
      </div>
      <Link
        to="/map"
        className="mb-[50px] bg-blue-500 box-border hover:bg-[transparent] hover:text-[#2C7FFF] transition-all border-[#2C7FFF] border-[2px] py-[4px] px-[16px] rounded-[8px] my-[10px] text-[30px]"
      >
        Go to the map
      </Link>

      <h2 className="text-[50px] mt-[10px]">Bibliography</h2>
      <div className="backdrop mb-[50px] w-[700px] mt-[30px] box-border p-[40px] flex flex-col gap-[15px] text-[#9198A1]">
        <h1>The following datasets were used:</h1>
        <h2>https://foreignassistance.gov/data</h2>
        <h2>
          https://wits.worldbank.org/CountryProfile/en/country/by-country/startyear/ltst/endyear/ltst/indicator/NY-GDP-MKTP-CD
        </h2>
        <h2>https://ourworldindata.org/grapher/unemployment-rate?time=2022</h2>
        <h2>https://ourworldindata.org/grapher/unemployment-rate?time=2022</h2>
        <h2> https://ourworldindata.org/human-development-index</h2>
        <h2>https://ourworldindata.org/life-expectancy</h2>
        <h2>https://ourworldindata.org/energy-production-consumption</h2>
      </div>
    </div>
  );
}
