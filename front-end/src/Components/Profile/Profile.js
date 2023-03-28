import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';

const Profile = ({ setAuth, isAuth }) => {
    const [chats, setChats] = useState([]);
    const logOut = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setAuth(false);
    }
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${document.cookie.slice(6, -8)}`
                    }
                };
                const response = await fetch('http://localhost:4001/api/chats', requestOptions);
                if (response.ok) {
                    console.log(response);
                }
            }
            catch (error) {
                console.error(error.message);
            }
        }
        fetchChats();
    }, [])
    return (
        <div>
            <Navbar isAuth={isAuth} />
            <h2>Profile</h2>
            <button onClick={logOut}>Log out</button>
            <div className="chats">

            </div>
        </div>
    )
}

export default Profile;