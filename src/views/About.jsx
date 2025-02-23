import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="w-[100vw] bg-red-300 flex flex-col items-center">
      <h1>Welcome to the about page</h1>
      <h1>Dispaly bibliography</h1>
      <p>
        ## Inspiration ## What it does ## How we built it ## Challenges we ran
        into ## Accomplishments that were proud of ## What we learned ## Whats
        next for Intervestment.tech
      </p>
      <Link to="/map" className="text-blue-500">
        go to map
      </Link>
    </div>
  );
}
