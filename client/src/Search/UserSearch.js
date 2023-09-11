import React, { useState } from "react"
import './UserSearch.css'
import { UserAuth } from "../Context/AuthContext";

const UserSearch = ({ selectedUser }) => {
    const { user } = UserAuth();

    const [searchedUsers, setSearchedUsers] = useState([]);
    const [inputVal, setInputVal] = useState('');

    const searchUsers = (e) => {
        setInputVal(e.target.value);
        if (e.target.value.length > 0) {
            fetch("/searchUsers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    searchInput: e.target.value
                })
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .then((data) => {
                    setSearchedUsers(data);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        } else {
            setSearchedUsers([])
        }
    }

    const handleSelectedUser = (user) => {
        selectedUser(user);
        setInputVal('');
        setSearchedUsers([]);
    }

    return (
        <>
            <input
                className='users_search_bar'
                value={inputVal}
                placeholder='Search...'
                onChange={searchUsers}
            />
            {searchedUsers.length > 0 &&
                <div className="searched_users">
                    <strong>Search:</strong>
                    {searchedUsers.map((searchedUser, index) => {
                        if (searchedUser.uid !== user.uid)
                            return (
                                <div key={index}>
                                    <button
                                        className="searched_users_buttons"
                                        onClick={() => handleSelectedUser(searchedUser)}
                                    >
                                        {searchedUser.displayName}
                                    </button>
                                    <br />
                                </div>
                            )
                    })}
                </div>
            }
        </>
    )
}

export default UserSearch;