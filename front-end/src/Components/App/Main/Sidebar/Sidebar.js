import React, { useState, useEffect, useRef } from "react";
import { Notify } from "notiflix/build/notiflix-notify-aio";

import { getRequestOptions } from "../../../../utils";

import "./Sidebar.css";

import SidebarHeader from "./SidebarHeader/SidebarHeader";
import ChatList from "./ChatList/ChatList";
import UserSearch from "./UserSearch/UserSearch";

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
  apiUrl,
  socket,
  moveScreenToBottom,
}) => {
  const [showUsers, setShowUsers] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]);

  // socket
  useEffect(() => {
    socket.on("remove chat", (data) => {
      const { removedChat } = data;
      const { user1_id, user2_id } = removedChat;
      if (mainUser.id == user1_id || mainUser.id == user2_id) {
        const newChats = chats.filter((chat) => {
          return chat.chat_id != removedChat.chat_id;
        });
        setMessages({});
        setChats(newChats);
        setCurChat({});
      }
    });
    socket.on("create chat", (data) => {
      if (mainUser.id == data.user1_id || mainUser.id == data.user2_id) {
        setChats([...chats, data.parseRes]);
      }
    });
  }, [chats, mainUser]);

  // functions that occur on click
  const fetchMessages = async (chat_id, chat_name) => {
    try {
      if (`${chat_id}` in messages) {
        setCurChat({ id: chat_id, name: chat_name });
        return console.log("Messages of the chat are already loaded");
      }

      const response = await fetch(
        `${apiUrl}/api/messages/${chat_id}`,
        getRequestOptions("GET", token)
      );
      const parseRes = await response.json();
      if (response.ok) {
        setMessages({ ...messages, [chat_id]: parseRes });
        setCurChat({ id: chat_id, name: chat_name });

        setTimeout(() => {
          moveScreenToBottom();
        }, 50);
      } else {
        console.log(parseRes);
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

  const onChangeSearchUsers = (e) => {
    if (!e.target.value) return setFoundUsers([]);

    // create regular expression for searching users when the input is changed
    const regex = new RegExp(`^${e.target.value}`, "i");
    const result = users.filter((user) => regex.test(user.username));
    setFoundUsers(result);
  };

  const onClickCreateChat = async (user) => {
    try {
      const body = { user1_name: mainUser.username, user2_name: user.username };
      if (!body.user1_name || !body.user2_name)
        return console.log("Some of the username is missed");

      // check if there is a chat with these users already
      const isChat = chats.some((chat) => {
        return (
          (chat.user1_id == mainUser.id && chat.user2_id == user.id) ||
          (chat.user1_id == user.id && chat.user2_id == mainUser.id)
        );
      });
      if (isChat) {
        Notify.failure(`Chat with this user exits already`, {
          position: "left-bottom",
        });
        return;
      }
      const response = await fetch(
        `${apiUrl}/api/chats/${mainUser.id}/${user.id}`,
        getRequestOptions("POST", token, body)
      );
      const parseRes = await response.json();
      if (response.ok) {
        Notify.success(`Chat ${parseRes.chat_name} was created!`, {
          position: "right-bottom",
        });
        socket.emit("create chat", {
          parseRes,
          user1_id: mainUser.id,
          user2_id: user.id,
        });
      } else {
        console.log(parseRes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickRemoveChat = async (chat) => {
    try {
      if (!chat) return console.log(`Chat is missing`);
      const response = await fetch(
        `${apiUrl}/api/chats/delete`,
        getRequestOptions("DELETE", token, chat)
      );
      const parseRes = await response.json();
      if (response.ok) {
        Notify.info(`Chat ${chat.chat_name} was deleted.`, {
          position: "right-bottom",
        });
        const updatedChats = chats.filter((c) => {
          return c.chat_id !== chat.chat_id;
        });
        socket.emit("remove chat", { updatedChats, removedChat: chat });
      } else {
        console.log(parseRes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Sidebar">
      <SidebarHeader
        onClickShowUsers={onClickShowUsers}
        showUsers={showUsers}
      />
      <ChatList
        chats={chats}
        onClickRemoveChat={onClickRemoveChat}
        fetchMessages={fetchMessages}
        curChat={curChat}
        mainUser={mainUser}
      />
      {showUsers ? (
        <UserSearch
          onChangeSearchUsers={onChangeSearchUsers}
          foundUsers={foundUsers}
          onClickCreateChat={onClickCreateChat}
        />
      ) : null}
    </div>
  );
};

export default Sidebar;
