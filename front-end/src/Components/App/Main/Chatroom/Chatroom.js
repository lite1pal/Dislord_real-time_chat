import React, { useState, useEffect } from "react";

import ChatMessages from "./ChatMessages/ChatMessages";
import ChatHeader from "./ChatHeader/ChatHeader";
import ChatInput from "./ChatInput/ChatInput";

import "./Chatroom.css";

const Chatroom = ({
  curChat,
  messages,
  sendMessage,
  onChangeMessageInput,
  messagesRef,
}) => {
  return (
    <div className="Chatroom">
      <ChatHeader curChat={curChat} />
      <ChatMessages
        curChat={curChat}
        messagesRef={messagesRef}
        messages={messages}
      />
      {curChat.id ? (
        <ChatInput
          sendMessage={sendMessage}
          onChangeMessageInput={onChangeMessageInput}
        />
      ) : null}
    </div>
  );
};

export default Chatroom;
