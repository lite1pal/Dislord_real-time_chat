import "./UserSearch.css";

const UserSearch = ({ onChangeSearchUsers, foundUsers, onClickCreateChat }) => {
  return (
    <div className="UserSearch">
      <input
        type="text"
        name="search"
        placeholder="Find users"
        autoComplete="off"
        autoFocus
        onChange={onChangeSearchUsers}
      />
      {foundUsers.length > 0 ? (
        <ul>
          {foundUsers.map((user) => {
            return (
              <li key={user.id}>
                <span>{user.username}</span>
                <button onClick={() => onClickCreateChat(user)}>
                  <i className="fa-sharp fa-solid fa-plus fa-xl"></i>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default UserSearch;
