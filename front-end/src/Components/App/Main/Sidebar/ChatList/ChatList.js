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
              className={activeChat === chat.id ? "active" : "no-active"}
              key={chat.id}
              onClick={() => {
                toggleFocus(chat.id);
                fetchMessages(chat.id, chat.chat_name);
              }}
            >
              <div className="chatlist-chat">
                <ul>
                  <li>
                    <img
                      width="50"
                      height="50"
                      src={
                        chat.user1_id == mainUser.id
                          ? chat.user2_avatar_url
                          : chat.user1_avatar_url
                      }
                    />
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
