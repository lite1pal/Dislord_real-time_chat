import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Cookies from "js-cookie"; // third-party module to get the cookies of the web app
import "./Profile.css";

const Profile = ({ setAuth, isAuth, socket }) => {
  /* uses useState() function to define state variables
     that will store in component even after render(),
     also you can reassign them with 'setVariable(newValue)'
     and this way make render() to invoke again */
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [mainUser, setMainUser] = useState({});
  const [curChat, setCurChat] = useState({});
  const [input, setInput] = useState("");
  const token = Cookies.get("token");

  const logOut = () => {
    // removes the cookies of a user after his logging out
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setAuth(false); // sets the status of authentication to false as the user got logged out
  };
  /* this function invokes each time the page is updated,
    very helpful to fetch all needed data in the beginning */
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // defines request parameters to send to a server
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // fetches data from a server
        const response = await fetch(
          `http://localhost:4001/api/chats/${Cookies.get("id")}`,
          requestOptions
        );
        // checks if response is valid, then sets response data to a state
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

  useEffect(() => {
    socket.on("chat message", (data) => {
      if (messages[curChat.id]) {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        setMessages({
          ...messages,
          [curChat.id]: [
            ...messages[curChat.id],
            {
              chat_id: data.chat_id,
              message: data.message,
              user_id: mainUser.id,
              user_name: mainUser.username,
              sent_at: today.toISOString(),
            },
          ],
        });
      }
    });
  }, [messages, curChat]);

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

  const onChangeInput = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const chat_id = curChat.id;
      const user_id = mainUser.id;
      const message = input;
      if (chat_id && user_id && message) {
        const body = { chat_id, user_id, message };
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        };
        const response = await fetch(
          `http://localhost:4001/api/messages/${chat_id}/${user_id}`,
          requestOptions
        );
        if (response.ok) {
          const parseRes = await response.json();
          socket.emit("chat message", {
            message: parseRes.message,
            chat_id: chat_id,
          });
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
            onClick={() => fetchMessages(chat.chat_id, chat.chat_name)}
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
        <h2>{curChat.name}</h2>
        <div className="messages">
          {curChat.id
            ? messages[`${curChat.id}`].map((message, index) => (
                <div className="message" key={index}>
                  {/* {
                    users.filter((user) => user["id"] === message.user_id)[0][
                      "username"
                    ]
                  } */}
                  {message.user_name}: {message.message}
                </div>
              ))
            : ""}
        </div>
        <form onSubmit={sendMessage}>
          <div className="sendBar">
            <input onChange={onChangeInput} type="text" name="message" />
            <button type="submit">SEND</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
