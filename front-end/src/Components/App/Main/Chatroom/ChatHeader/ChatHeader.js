import "./ChatHeader.css";

const ChatHeader = ({ curChat }) => {
  return (
    <div className="ChatHeader">
      {curChat.name ? curChat.name.split(" ")[1] : "..."}
    </div>
  );
};

export default ChatHeader;
