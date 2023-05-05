import { useEffect, useState } from "react";

import "./ChatList.css";

const ChatList = ({
  chats,
  onClickRemoveChat,
  fetchMessages,
  curChat,
  mainUser,
}) => {
  const [activeChat, setActiveChat] = useState(null);

  const toggleFocus = (index) => {
    setActiveChat(index);
  };

  useEffect(() => {}, [activeChat]);

  return (
    <div className="ChatList">
      <ul>
        {Array.isArray(chats) &&
          chats.map((chat) => (
            <li
              className={activeChat === chat.chat_id ? "active" : "no-active"}
              key={chat.chat_id}
              onClick={() => {
                toggleFocus(chat.chat_id);
                fetchMessages(chat.chat_id, chat.chat_name);
              }}
            >
              <div className="chatlist-chat">
                <ul>
                  <li>
                    {chat.chat_name
                      .split(", ")
                      .filter((user) => user !== mainUser.username)}
                  </li>
                  <li>
                    <div className="chat-delete">
                      <i
                        onClick={(e) => {
                          e.stopPropagation();
                          onClickRemoveChat(chat);
                        }}
                        className="fa-solid fa-trash"
                      ></i>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChatList;
