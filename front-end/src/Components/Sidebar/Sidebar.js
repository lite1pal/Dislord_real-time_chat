import React, { useState, useEffect } from "react";

const Sidebar = ({
  chats,
  setMessages,
  setCurChat,
  messages,
  curChat,
  token,
}) => {
  const fetchMessages = async (chat_id, chat_name) => {
    try {
      if (`${chat_id}` in messages) {
        setCurChat({ id: chat_id, name: chat_name });
        console.log("Messages of the chat are already loaded");
      } else {
        const requestOptions = {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await fetch(
          `http://localhost:4001/api/messages/${chat_id}`,
          requestOptions
        );
        if (response.ok) {
          const parseRes = await response.json();
          setMessages({ ...messages, [chat_id]: parseRes });
          setCurChat({ id: chat_id, name: chat_name });
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    // <div>
    //   <h2>Chats</h2>
    //   {chats.map((chat) => (
    //     <button
    //       onClick={() => fetchMessages(chat.chat_id, chat.chat_name)}
    //       key={chat.chat_id}
    //     >
    //       {chat.chat_name}
    //     </button>
    //   ))}
    //   <h3>Add a new chat</h3>
    //   <button>+</button>
    // </div>

    // <div className="w-1/4 h-full border-r border-gray-300">
    //   <div className="p-4 bg-gray-100 border-b border-gray-300">
    //     <h2 className="text-lg font-bold">Chats</h2>
    //   </div>
    //   <ul className="flex flex-col p-4 space-y-2">
    //     {chats.map((chat) => (
    //       <li
    //         key={chat.chat_id}
    //         className={`p-2 rounded-md cursor-pointer ${
    //           curChat === chat.chat_id
    //             ? "bg-blue-500 text-white"
    //             : "hover:bg-gray-200"
    //         }`}
    //         onClick={() => fetchMessages(chat.chat_id, chat.chat_name)}
    //       >
    //         {chat.chat_name}
    //       </li>
    //     ))}
    //   </ul>
    //   <div className="p-4 bg-gray-100 border-t border-gray-300">
    //     <h3 className="text-md font-bold">Add a new chat</h3>
    //     <button className="w-10 h-10 bg-blue-500 rounded-full text-white font-bold">
    //       +
    //     </button>
    //   </div>
    // </div>

    <div className="w-1/4 h-full bg-gray-800">
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">Chats</h2>
      </div>
      <ul className="flex flex-col p-4 space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.chat_id}
            className={`p-2 rounded-md cursor-pointer ${
              curChat === chat.chat_id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
            onClick={() => fetchMessages(chat.chat_id, chat.chat_name)}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 rounded-full bg-gray-500"></div>
              <span className="text-sm font-medium text-white">
                {chat.chat_name}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <h3 className="text-md font-bold text-white">Add a new chat</h3>
        <button className="w-10 h-10 bg-blue-600 rounded-full text-white font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm5 13a1 1 0 01-2 0V11H13a1 1 0 010-2h2V7a1 1 0 112 0v2h2a1 1 0 110 2h-2v2z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
