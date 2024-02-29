import classNames from "classnames";
import React from "react";

export default function Button(props: {
  onClick: () => void;
  disabled?: boolean;
  height?: string;
  width?: string;
  children: React.ReactNode;
}) {
  const {
    onClick,
    children,
    height = "80px",
    width = "240px",
    disabled,
  } = props;
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ height, width }}
      className={classNames(
        "flex items-center justify-center  shadow-[#ffffff]/40 drop-shadow-xl shadow-inner rounded-2xl text-slate-100 font-semibold",
        disabled ? "pointer-events-none bg-slate-500" : "bg-gradient-to-r from-[#303f47] to-[#06131f] hover:from-[#395666] hover:to-[#153552]"
      )}
    >
      {children}
    </button>
  );
}
