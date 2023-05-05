import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Chatroom from "./Chatroom/Chatroom";
import Cookies from "js-cookie"; // third-party module to manage the cookies of the web app

import "./Main.css";

import { getRequestOptions } from "../../../utils";

const Main = ({ setAuth, isAuth, socket, apiUrl }) => {
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
  const messagesRef = useRef(null);

  /* this function invokes each time the page is updated,
    very helpful to fetch all needed data in the beginning */
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // fetches data from a server
        const response = await fetch(
          `${apiUrl}/api/chats/${Cookies.get("id")}`,
          getRequestOptions("GET", token)
        );
        // checks if response is valid, then sets response data to a state
        const parseRes = await response.json();
        if (response.ok) {
          setChats(parseRes);
        } else {
          console.log(parseRes);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/users`,
          getRequestOptions("GET", token)
        );
        const parseRes = await response.json();
        if (response.ok) {
          const fetchedUsers = parseRes.filter((user) => {
            return user.id != Cookies.get("id");
          });
          setUsers(fetchedUsers);
        } else {
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
        setMessages({
          ...messages,
          [curChat.id]: [
            ...messages[curChat.id],
            {
              message_id: data.message_id,
              chat_id: data.chat_id,
              message: data.message,
              user_id: data.user_id,
              user_name: data.user_name,
              sent_at: data.sent_at,
            },
          ],
        });
      }
    });
  }, [messages, curChat]);

  const onChangeMessageInput = (e) => {
    setInput(e.target.value);
  };

  const moveScreenToBottom = () => {
    const messagesDiv = messagesRef.current;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      // removes text off the message input after message is sent
      e.target.message.value = "";

      const chat_id = curChat.id;
      const user_id = mainUser.id;
      const user_name = mainUser.username;

      // matches URLs starting with http, https, ftp, or file
      const regex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

      // wraps URLs in <a> tags with target="_blank" to open in a new tab and rel="noopener noreferrer" for security
      let message = input.replace(
        regex,
        '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #84D2F6">$1</a>'
      );

      const sent_at = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
      });

      if (!chat_id || !user_id || !message || !user_name || !sent_at) {
        return console.log(
          "Something from data is missing, check sendMessage() in Main.js"
        );
      }

      const body = { chat_id, user_id, message, user_name, sent_at };

      const response = await fetch(
        `${apiUrl}/api/messages/${chat_id}/${user_id}`,
        getRequestOptions("POST", token, body)
      );
      const parseRes = await response.json();
      if (response.ok) {
        socket.emit("chat message", parseRes);

        // scrolls messages div to the bottom after the message is added
        setTimeout(() => {
          moveScreenToBottom();
        }, 25);
      } else {
        console.log(parseRes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="Main">
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
        apiUrl={apiUrl}
        socket={socket}
        moveScreenToBottom={moveScreenToBottom}
      />
      <Chatroom
        curChat={curChat}
        messages={messages}
        onChangeMessageInput={onChangeMessageInput}
        sendMessage={sendMessage}
        token={token}
        messagesRef={messagesRef}
      />
    </div>
  );
};

export default Main;
