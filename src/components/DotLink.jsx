export default function DotLink({ id, page, navigate }) {
  return (
    <button
      onClick={navigate}
      className={`w-[15px] h-[15px] rounded-[70px] bg-[transparent] border-[5px] border-[#3D444D]  ${id == page ? "bg-white" : ""}`}
    ></button>
  );
}
