import ChatMessage from "./ChatMessage/ChatMessage";

import "./ChatMessages.css";

const ChatMessages = ({ curChat, messages, messagesRef }) => {
  return (
    <div ref={messagesRef} className="ChatMessages">
      <ul>
        {curChat.id && Array.isArray(messages[`${curChat.id}`]) ? (
          messages[`${curChat.id}`].map((message) => (
            <li key={message.id}>
              <ChatMessage message={message} />
            </li>
          ))
        ) : (
          <div>No messages to show.</div>
        )}
      </ul>
    </div>
  );
};

export default ChatMessages;
