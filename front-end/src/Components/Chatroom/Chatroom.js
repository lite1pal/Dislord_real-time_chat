import React, { useState, useEffect } from "react";

const Chatroom = ({ curChat, messages, sendMessage, onChangeMessageInput }) => {
  return (
    <div className="fixed top-20 right-0 flex justify-center items-center w-9/12 h-full">
      <div className="w-full h-full bg-gray-800 text-white">
        <div className="p-4 bg-gray-700 border-b border-gray-600">
          <h2 className="text-lg font-bold">{curChat.name}</h2>
        </div>
        <div
          className="h-80 p-4 overflow-y-scroll"
          style={{ flexDirection: "column-reverse" }}
        >
          {curChat.id ? (
            messages[`${curChat.id}`].map((message) => (
              <div key={message.message_id} className="mb-2">
                <span className="font-bold text-gray-300">
                  {message.user_name}:{" "}
                </span>
                <span className="text-gray-400">{message.message}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">
              No messages to show.
            </div>
          )}
        </div>
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
            <button className="w-24 h-10 bg-discord-blue text-white font-bold rounded-md hover:bg-discord-dark-blue transition-colors duration-300">
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
