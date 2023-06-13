import validator from "validator";

import "./ChatMessage.css";

const ChatMessage = ({ message }) => {
  const createdAt = new Date(message.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
  });
  return (
    <div className="ChatMessage">
      <span className="sender">
        <img width="50" height="50" src={message.avatar_url} />
        <a href="#" tabIndex="-1">
          {message.user_name}
        </a>
      </span>
      <span className="sent_at"> {createdAt}</span>
      <div className="message">
        <p
          dangerouslySetInnerHTML={{
            __html: validator.escape(message.message),
          }}
        ></p>
      </div>

      {/* <button className="text-red-500">Delete</button> */}
    </div>
  );
};

export default ChatMessage;
