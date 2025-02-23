import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

export default function Layout() {
  return (
    <div className="h-[100vh] flex flex-col">
      <Nav />
      <Outlet />
    </div>
  );
}
