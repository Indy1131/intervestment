import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <div className="sticky top-0 bg-[black] w-[100vw] border-[#2F353D] border-b-[1px] flex justify-center flex-col items-center">
      <div className="w-[min(1000px,calc(100vw-20px))] flex gap-[10px] items-center">
        <NavLink to="/" className={`py-[12px]`}>
          Intervestment.tech
        </NavLink>
        {/* <NavLink
          to="/sentiment"
          className={({ isActive }) =>
            (isActive ? "text-white" : "text-[#9198A1]") +
            " ml-[auto] py-[4px] px-[16px] bg-[#151A23] border-[1px] border-[#2E343D] rounded-[4px] hover:bg-black"
          }
          style={{ transition: "all .2s ease-out" }}
        >
          Sentiment
        </NavLink> */}
        <NavLink
          to="/map"
          className={({ isActive }) =>
            (isActive ? "text-white" : "text-[#9198A1]") +
            " ml-auto py-[4px] px-[16px] bg-[#151A23] border-[1px] border-[#2E343D] rounded-[4px] hover:bg-black"
          }
          style={{ transition: "all .2s ease-out" }}
        >
          Map
        </NavLink>
      </div>
    </div>
  );
}
