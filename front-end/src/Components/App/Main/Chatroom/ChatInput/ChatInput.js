import "./ChatInput.css";

const ChatInput = ({ sendMessage, onChangeMessageInput }) => {
  return (
    <div className="ChatInput">
      <form onSubmit={sendMessage}>
        <input
          type="text"
          name="message"
          placeholder="Message #general"
          onChange={onChangeMessageInput}
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default ChatInput;
