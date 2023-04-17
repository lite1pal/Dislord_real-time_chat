const UserSearch = ({ onChangeSearchUsers, foundUsers, onClickCreateChat }) => {
  return (
    <div className="p-4 bg-gray-900 border-t border-gray-700 rounded-t-lg">
      <input
        className="w-2/3 mr-4 mb-5 py-2 px-3 rounded-md bg-gray-600 text-white placeholder-gray-300 focus:outline-none focus:bg-gray-700"
        type="text"
        name="search"
        placeholder="Find users"
        autoComplete="off"
        autoFocus
        onChange={onChangeSearchUsers}
      />
      {foundUsers.length > 0 ? (
        <div className="bg-gray-800 rounded-md p-4">
          <ul>
            {foundUsers.map((user) => {
              return (
                <li
                  className="flex items-center justify-between py-2"
                  key={user.id}
                >
                  <span className="text-white">{user.username}</span>
                  <button
                    onClick={() => onClickCreateChat(user)}
                    className="w-20 h-8 rounded-md bg-blue-400 text-white font-bold hover:bg-blue-500"
                  >
                    Add
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default UserSearch;
