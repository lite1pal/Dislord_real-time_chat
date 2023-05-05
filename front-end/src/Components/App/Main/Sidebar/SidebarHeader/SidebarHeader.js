import "./SidebarHeader.css";

const SidebarHeader = ({ onClickShowUsers, showUsers }) => {
  return (
    <div className="SidebarHeader">
      <ul>
        <li>direct messages</li>
        <li>
          {showUsers ? (
            <i onClick={onClickShowUsers} className="fa-solid fa-xmark"></i>
          ) : (
            <i onClick={onClickShowUsers} className="fa-solid fa-plus"></i>
          )}
        </li>
      </ul>
      {/* <button onClick={onClickShowUsers}>
        {showUsers ? "..." : "New chat"}
      </button> */}
    </div>
  );
};

export default SidebarHeader;
