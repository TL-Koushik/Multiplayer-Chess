import React from "react";
import Msgsent from "./Msgsent";
import Msgrec from "./Msgrec";

const Chat = ({ name, messages, playerId, onSend, value, onChange }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">

      {/* HEADER */}
      <div className="px-4 py-3 border-b dark:border-zinc-700 flex justify-between">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
          {name}
        </h2>
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          Online
        </span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg, index) =>
          msg.sent === playerId ? (
            <Msgsent key={index} msg={msg.msg} />
          ) : (
            <Msgrec key={index} msg={msg.msg} />
          )
        )}
      </div>

      {/* INPUT */}
      <div className="px-3 py-2 border-t dark:border-zinc-700 flex gap-2">
        <input
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white text-sm"
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button
          onClick={onSend}
          className="bg-blue-500 hover:bg-blue-700 text-white px-3 rounded-lg text-sm"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default Chat;
