const ChatMessage = ({ message }) => {
  return (
    <div
      key={message.message_id}
      className="hover:bg-gray-800 mb-2 p-1 flex items-center justify-between"
    >
      <div>
        <span className="font-medium text-white">
          <a className="hover:underline" href="#">
            {message.user_name}
          </a>
        </span>
        <span className="font-light text-gray-300 text-xs ml-5 cursor-default">
          {message.sent_at}
        </span>
        <p
          dangerouslySetInnerHTML={{ __html: message.message }}
          className="block text-gray-200"
        ></p>
      </div>
      {/* <button className="text-red-500">Delete</button> */}
    </div>
  );
};

export default ChatMessage;
