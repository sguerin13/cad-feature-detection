import React from "react";

export default function Button(props: {
  onClick: () => void;
  height?: string;
  width?: string;
  children: React.ReactNode;
}) {
  const { onClick, children, height = "80px", width = "240px" } = props;
  return (
    <button
      onClick={onClick}
      style={{ height, width }}
      className="flex items-center justify-center bg-gradient-to-r from-[#303f47] to-[#06131f] hover:from-[#395666] hover:to-[#153552] shadow-[#ffffff]/40 drop-shadow-xl shadow-inner rounded-2xl text-slate-100 font-semibold"
    >
      {children}
    </button>
  );
}
