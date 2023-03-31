import React, { useState, useEffect } from "react";

const Chatroom = ({ curChat, messages, sendMessage, onChangeMessageInput }) => {
  return (
    <div className="w-3/4 h-full bg-white mt-20 m-auto">
      <div className="p-4 bg-gray-100 border-b border-gray-300">
        <h2 className="text-lg font-bold">{curChat.name}</h2>
      </div>
      <div className="h-5/6 p-4 overflow-auto">
        {curChat.id ? (
          messages[`${curChat.id}`].map((message, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">{message.user_name}: </span>
              <span>{message.message}</span>
            </div>
          ))
        ) : (
          <div className="text-center">No messages to show.</div>
        )}
      </div>
      <div className="p-4 bg-gray-100 border-t border-gray-300">
        <form className="flex justify-between" onSubmit={sendMessage}>
          <input
            className="w-full mr-4 py-2 px-3 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
            type="text"
            name="message"
            placeholder="Type your message here"
            onChange={onChangeMessageInput}
          />
          <button className="w-24 h-10 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors duration-300">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatroom;
