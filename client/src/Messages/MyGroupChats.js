import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import LazyLoadingGroupMessages from "./LazyLoadingGroupMessages";
import { UserAuth } from "../Context/AuthContext";
import { BiArrowBack } from 'react-icons/bi';
import { MdOutlineSpeakerGroup } from "react-icons/md";

const MyGroupChats = ({ showMyChats }) => {

    const { user } = UserAuth();
    const db = getDatabase();
    const groupChatsRef = ref(db, '/groupChats');
    const [groupChats, setGroupChats] = useState([])

    useEffect(() => {
        if (user != null) {
            onValue(groupChatsRef, (snapshot) => {
                const chats = snapshot.val();
                const userChats = [];
                for (const chat in chats) {
                    for (const member of chats[chat].users) {
                        if (member.uid === user.uid) {
                            userChats.push({ id: chat, name: chats[chat].name });
                            break;
                        }
                    }
                }
                setGroupChats(userChats);
            });
        }
    }, [user]);

    const [groupID, setGroupID] = useState();
    const [showChat, setShowChat] = useState(false);
    const [showUsers, setShowUsers] = useState(true);
    const handleClick = (id) => {
        if (!(id.length > 0)) {
            showMyChats(true)
        } else {
            showMyChats(false);
        }
        setShowChat(current => !current);
        setGroupID(id);
        setShowUsers(current => !current);
    }

    const [showAll, setShowAll] = useState(false);

    if (groupChats.length) {
        return (
            <>
                {showUsers ?
                    <>
                        {groupChats.slice(0, showAll ? groupChats.length : 3).map((chat) => (
                            <div key={chat.id} style={{marginBlock: '0.25em'}}>
                                <button className="user_list" onClick={() => handleClick(chat.id)}>{chat.name}</button>
                            </div>
                        ))}
                        {groupChats.length > 3 &&
                            <button className="show_all" onClick={() => setShowAll(!showAll)}>
                                {showAll ? 'Hide' : 'Show all'}
                            </button>}
                    </>
                    : <button className="back_button" onClick={() => handleClick({})}><BiArrowBack /></button>
                }
                {showChat && <LazyLoadingGroupMessages groupID={groupID} />}
            </>
        )
    }
}

export default MyGroupChats