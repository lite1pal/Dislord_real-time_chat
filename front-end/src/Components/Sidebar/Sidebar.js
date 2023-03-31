import React, { useState, useEffect, useId } from "react";

const Sidebar = ({
  chats,
  setMessages,
  setCurChat,
  messages,
  curChat,
  token,
  users,
  mainUser,
  setChats,
}) => {
  const [showUsers, setShowUsers] = useState(false);
  const id = useId();
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
          `http://192.168.0.114:4001/api/messages/${chat_id}`,
          requestOptions
        );
        if (response.ok) {
          const parseRes = await response.json();
          setMessages({ ...messages, [chat_id]: parseRes });
          setCurChat({ id: chat_id, name: chat_name });
        } else {
          const parseRes = await response.json();
          console.log(parseRes);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onClickShowUsers = () => {
    if (showUsers) {
      setShowUsers(false);
    } else {
      setShowUsers(true);
    }
  };

  const onClickCreateChat = async (user) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          // "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `http://192.168.0.114:4001/api/chats/${mainUser.id}/${user.id}`,
        requestOptions
      );
      console.log("works");
      if (response.ok) {
        const parseRes = await response.json();
        setChats([...chats, parseRes]);
      } else {
        const parseRes = await response.json();
        console.log(parseRes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-1/4 h-full bg-gray-800">
      <div className="p-4 bg-gray-900 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">Chats</h2>
      </div>
      <ul className="flex flex-col p-4 space-y-2">
        {Array.isArray(chats) &&
          chats.map((chat, index) => (
            <li
              key={index}
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
      <div className="p-4 bg-gray-900 border-t border-gray-700 rounded-t-lg">
        <h3 className="text-lg font-bold text-white mb-2">Add a new chat</h3>
        {showUsers ? (
          <div className="bg-gray-800 rounded-md p-4">
            {console.log(curChat.name)}
            <ul>
              {users.map((user) => {
                return (
                  <li
                    className="flex items-center justify-between py-2"
                    key={user.id}
                  >
                    <span className="text-white">{user.username}</span>
                    <button
                      onClick={() => onClickCreateChat(user)}
                      className="w-20 h-8 rounded-md bg-blue-400 text-white font-bold hover:bg-blue-500"
                    >
                      Add
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        <button
          onClick={onClickShowUsers}
          className="w-10 h-10 bg-blue-600 rounded-full text-white font-bold mt-4"
        >
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
