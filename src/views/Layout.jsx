import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import { useState, useEffect, createContext } from "react";

export const DataContext = createContext();

export default function Layout() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Array of URLs to fetch (replace with your actual URLs)
        const urls = [
          "http://localhost:3000/?name=data",
          "http://localhost:3000/?name=fits",
          "http://localhost:3000/?name=fitScores",
          "http://localhost:3000/?name=global",
          "http://localhost:3000/?name=inputs",
          "http://localhost:3000/?name=ROIs",
          "http://localhost:3000/?name=structured",
        ];

        // Use Promise.all to fetch all files in parallel
        const results = await Promise.all(
          urls.map((url) =>
            fetch(url).then((response) => {
              if (!response.ok) {
                throw new Error(`Error fetching ${url}`);
              }
              return response.json();
            })
          )
        );

        // Set the fetched data
        setResponse(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!response.length) return <p>No data available</p>;

  const data = response[0];
  const fits = response[1];
  const fitScores = response[2];
  const global = response[3];
  const inputs = response[4];
  const ROIs = response[5];
  const structured = response[6];

  return (
    <div className="h-[100vh] flex flex-col">
      <Nav />
      <DataContext.Provider
        value={{ data, fits, fitScores, global, inputs, ROIs, structured }}
      >
        <Outlet />
      </DataContext.Provider>
    </div>
  );
}
