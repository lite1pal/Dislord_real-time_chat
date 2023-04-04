import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Chatroom from "../Chatroom/Chatroom";
import Cookies from "js-cookie"; // third-party module to get the cookies of the web app

const Main = ({ setAuth, isAuth, socket }) => {
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
          `https://dislord-chat-app.onrender.com/api/chats/${Cookies.get(
            "id"
          )}`,
          requestOptions
        );
        // checks if response is valid, then sets response data to a state
        if (response.ok) {
          const parseRes = await response.json();
          setChats(parseRes);
        } else {
          const parseRes = await response.json();
          console.log(parseRes);
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
          "https://dislord-chat-app.onrender.com/api/users",
          requestOptions
        );
        if (response.ok) {
          const parseRes = await response.json();
          setUsers(parseRes);
        } else {
          const parseRes = await response.json();
          console.log(parseRes);
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

  const onChangeMessageInput = (e) => {
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
          `https://dislord-chat-app.onrender.com/api/messages/${chat_id}/${user_id}`,
          requestOptions
        );
        if (response.ok) {
          const parseRes = await response.json();
          console.log(parseRes);
          socket.emit("chat message", {
            message: parseRes.message,
            chat_id: chat_id,
          });
        } else {
          const parseRes = await response.json();
          console.log(parseRes);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <Navbar isAuth={isAuth} mainUser={mainUser} setAuth={setAuth} />
      <Sidebar
        chats={chats}
        curChat={curChat}
        setCurChat={setCurChat}
        messages={messages}
        setMessages={setMessages}
        token={token}
        users={users}
        mainUser={mainUser}
        setChats={setChats}
      />
      <Chatroom
        curChat={curChat}
        messages={messages}
        onChangeMessageInput={onChangeMessageInput}
        sendMessage={sendMessage}
        token={token}
      />
    </div>
  );
};

export default Main;
