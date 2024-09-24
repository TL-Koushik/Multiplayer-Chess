import React from "react";
const Msgsent=({msg})=>{
    return <div className="chat-message self-end bg-blue-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm">
   {msg}
  </div>;
}
export default Msgsent;