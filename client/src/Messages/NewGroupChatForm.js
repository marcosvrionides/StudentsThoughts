import React, { useEffect, useRef, useState } from "react";
import "./Messages.css"
import UserSearch from "../Search/UserSearch";
import { UserAuth } from "../Context/AuthContext";
import { useNavigate } from 'react-router-dom';
import BackButton from "../BackButton/BackButton";

function NewGroupChatForm() {
    const { user } = UserAuth();
    const navigate = useNavigate()

    const groupName = useRef(null);
    const [usersInGroup, setUsersInGroup] = useState([]);

    useEffect(() => {
        if (user.uid !== undefined) {
            setUsersInGroup([{ uid: user.uid, displayName: user.displayName }, ...usersInGroup])
        }
    }, [user])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (groupName && usersInGroup.length > 1) {
            fetch("/createGroup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: groupName.current.value,
                    creator: user.displayName,
                    users: usersInGroup
                })
            })
            e.target.reset();
            navigate('/home');
        } else {
            alert('error')
        }
    }

    const handleSelectedUser = (user) => {
        for (let i = 0; i < usersInGroup.length; i++) {
            if (usersInGroup[i].uid === user.uid) {
                alert('You already added ' + user.displayName + ' to the group.');
                return;
            }
        }
        setUsersInGroup([...usersInGroup, { uid: user.uid, displayName: user.displayName }])
    }

    return (
        <>
            <form className='new_group_chat_form' onSubmit={handleSubmit}>
                <h1 style={{display: 'flex', gap: '1em'}}><BackButton />Create a new group</h1>
                <div className='form_element'>
                    <label style={{ marginRight: '1em' }} htmlFor='group_name_input'>Group name:</label>
                    <input ref={groupName} id='group_name_input' type={'text'} placeholder='group name...'></input>
                </div>
                <div className="form_element">
                    <label style={{ marginRight: '1em' }}>Add people:</label>
                    <UserSearch selectedUser={handleSelectedUser} />
                    {usersInGroup.map((user, index) => {
                        return (
                            <ul key={index}><li>{user.displayName}</li></ul>
                        )
                    })}
                </div>
                <div className='form_element'>Created by: {user.email}</div>
                <div className='submit_form_button' align='right'><input type={'submit'} /></div>
            </form>
        </>
    )
}

export default NewGroupChatForm