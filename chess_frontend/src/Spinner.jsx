import React from "react";

const Spinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
