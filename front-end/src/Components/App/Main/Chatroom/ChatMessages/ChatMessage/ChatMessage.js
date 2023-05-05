import validator from "validator";

import "./ChatMessage.css";

const ChatMessage = ({ message }) => {
  return (
    <div className="ChatMessage">
      <span className="sender">
        <a href="#" tabIndex="-1">
          {message.user_name}
        </a>
      </span>
      <span className="sent_at"> {message.sent_at}</span>
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
