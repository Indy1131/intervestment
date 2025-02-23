import Layout from "./views/Layout";
import ErrorPage from "./views/ErrorPage";
import About from "./views/About";
import MapPage from "./views/MapPage";
import SentimentPage from "./views/SentimentPage";

export default [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <About /> },
      { path: "/sentiment", element: <SentimentPage /> },
      { path: "/map", element: <MapPage /> },
    ],
  },
];
