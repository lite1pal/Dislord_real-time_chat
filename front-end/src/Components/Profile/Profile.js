import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Cookies from "js-cookie";
import "./Profile.css";

const Profile = ({ setAuth, isAuth }) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [mainUser, setMainUser] = useState({});
  const [curChat, setCurChat] = useState("");
  const [messages, setMessages] = useState({});
  const logOut = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setAuth(false);
  };
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = Cookies.get("token");
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch(
          "http://localhost:4001/api/chats",
          requestOptions
        );
        if (response.ok) {
          const parseRes = await response.json();
          setChats(parseRes);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("token");
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await fetch(
          "http://localhost:4001/api/users",
          requestOptions
        );
        if (response.ok) {
          const parseRes = await response.json();
          setUsers(parseRes);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    setMainUser({
      id: Cookies.get("id"),
      username: Cookies.get("username"),
      email: Cookies.get("email"),
    });
    fetchChats();
    fetchUsers();
  }, []);

  const fetchMessages = async (chat_id) => {
    try {
      if (`${chat_id}` in messages) {
        setCurChat(chat_id);
        console.log("Messages of the chat are already loaded");
      } else {
        const token = Cookies.get("token");
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
          setCurChat(chat_id);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="body">
      <Navbar isAuth={isAuth} />
      <h2>{mainUser["username"]}</h2>
      <button onClick={logOut}>Log out</button>
      <div className="chats">
        <h2>Chats</h2>
        {chats.map((chat) => (
          <button
            onClick={() => fetchMessages(chat.chat_id)}
            className="chatButtons"
            key={chat.chat_id}
          >
            {chat.chat_name}
          </button>
        ))}
        <h3>Add a new chat</h3>
      </div>
      <button id="addChat">+</button>
      <div className="chatRoom">
        <div className="messages">
          {curChat
            ? messages[`${curChat}`].map((message) => (
                <div className="message" key={message.message_id}>
                  {
                    users.filter((user) => user["id"] === message.user_id)[0]
                      .username
                  }
                  : {message.message}
                </div>
              ))
            : ""}
        </div>
        <div className="sendBar">
          <input type="text" name="message" />
          <button>SEND</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
