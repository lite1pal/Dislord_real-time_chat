import React, { useState, useEffect } from "react";

import ChatMessage from "../ChatMessage/ChatMessage";

const Chatroom = ({ curChat, messages, sendMessage, onChangeMessageInput }) => {
  return (
    <div className="fixed top-20 right-0 flex justify-center items-center w-9/12">
      <div className="w-full h-full bg-gray-700 text-white">
        <div className="p-4 bg-gray-700 border-b border-gray-600">
          <h2 className="text-lg font-bold">
            {curChat.name ? curChat.name.split(" ")[1] : "..."}
          </h2>
        </div>
        <div
          className="h-80 p-4 overflow-y-scroll"
          style={{ flexDirection: "column-reverse" }}
        >
          {curChat.id && Array.isArray(messages[`${curChat.id}`]) ? (
            messages[`${curChat.id}`].map((message) => (
              <ChatMessage key={message.message_id} message={message} />
            ))
          ) : (
            <div className="text-center text-gray-400">
              No messages to show.
            </div>
          )}
        </div>

        {curChat.id ? (
          <div className="p-4 bg-gray-700 border-t border-gray-600">
            <form
              className="flex justify-between items-center"
              onSubmit={sendMessage}
            >
              <input
                className="w-full mr-4 py-2 px-3 rounded-md bg-gray-500 text-white placeholder-gray-300 focus:outline-none focus:bg-gray-600"
                type="text"
                name="message"
                placeholder="Message #general"
                onChange={onChangeMessageInput}
                autoComplete="off"
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Chatroom;
