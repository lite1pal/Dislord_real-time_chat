const SidebarHeader = ({ onClickShowUsers, showUsers }) => {
  return (
    <div className="p-4 bg-gray-900 border-b border-gray-700">
      <h2 className="text-lg inline font-bold text-white">Chats</h2>
      <button
        onClick={onClickShowUsers}
        className="w-20 h-8 ml-48 rounded-md bg-stone-500 text-white font-bold hover:bg-blue-500"
      >
        {showUsers ? "..." : "New chat"}
      </button>
    </div>
  );
};

export default SidebarHeader;
