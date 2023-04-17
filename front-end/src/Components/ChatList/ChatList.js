const ChatList = ({ chats, onClickRemoveChat, fetchMessages, curChat }) => {
  return (
    <ul className="flex flex-col p-4 space-y-2">
      {Array.isArray(chats) &&
        chats.map((chat) => (
          <li
            key={chat.chat_id}
            onClick={() => fetchMessages(chat.chat_id, chat.chat_name)}
            className={`p-2 rounded-md cursor-pointer ${
              curChat === chat.chat_id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 rounded-full bg-gray-500"></div>
                <span className="text-sm font-medium text-white">
                  {chat.chat_name.split(" ")[1]}
                </span>
              </div>
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickRemoveChat(chat);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default ChatList;
