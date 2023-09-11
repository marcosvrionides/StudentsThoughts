import React, { useState, useEffect } from "react";
import { getDatabase, ref, onChildAdded, onChildChanged, onValue } from "firebase/database";
import LazyLoadingMessages from "./LazyLoadingMessages";
import { UserAuth } from "../Context/AuthContext";
import { BiArrowBack } from 'react-icons/bi';
import { MdMarkChatUnread } from 'react-icons/md';

const MyChats = (props) => {

    const { user } = UserAuth();
    const db = getDatabase();
    const messagesRef = ref(db, '/messages');
    const [messages, setMessages] = useState([]);
    const [cleanedMessages, setCleanedMessages] = useState([]);

    const [updateMessages, setUpdateMessages] = useState(false);
    useEffect(() => {
        setUpdateMessages(false);
        if (user != null) {
            onChildAdded(messagesRef, (chat) => {
                chat.forEach(message => {
                    if ((message.val().fromUid) === user.uid) {
                        setMessages((messages) => [...messages, { uid: message.val().to, read: message.val().read, fromCurrentUser: true }]);
                    } else if ((message.val().to) === user.uid) {
                        setMessages((messages) => [...messages, { uid: message.val().fromUid, read: message.val().read, fromCurrentUser: false }]);
                    }
                })

            })
        }
    }, [user, updateMessages]);

    useEffect(() => {
        onChildChanged(messagesRef, () => {
            setUpdateMessages(true);
        })
    }, [])

    useEffect(() => {
        let cleanedMessage = [];
        for (let i = messages.length - 1; i >= 0; i--) {
            let included = false;
            let read = 'read';
            if (!messages[i].fromCurrentUser) {
                read = messages[i].read;
            }
            for (let j = 0; j < cleanedMessage.length; j++) {
                if (cleanedMessage[j].uid === messages[i].uid) {
                    included = true;
                }
            }
            if (!included) {
                cleanedMessage = [...cleanedMessage, { uid: messages[i].uid, read: read }]
            }
        }
        setCleanedMessages(cleanedMessage);
    }, [messages])


    const [usersList, setUsersList] = useState([]); //list of objects of all users that the current user has messages with
    useEffect(() => {
        const promises = cleanedMessages.map((message) =>
            fetch("/searchUsers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    searchInput: message.uid,
                }),
            }).then((response) => response.json())
                .then((res) => {
                    res[0].read = message.read;
                    return res;
                })
        );

        Promise.all(promises)
            .then((data) => {
                const users = data.map((userData) => userData[0]);
                setUsersList(users);
            })
    }, [cleanedMessages]);

    const [uid, setUid] = useState(user.uid);
    const [showChat, setShowChat] = useState(false);
    const [showUsers, setShowUsers] = useState(true);
    const handleClick = (chatWith) => {
        if (!chatWith.length > 0) {
            props.showMyGroupChats(true)
        } else {
            props.showMyGroupChats(false);
        }
        for (let i = 0; i < usersList.length; i++) {
            if (usersList[i].uid === chatWith) {
                usersList[i].read = 'read';
                break;
            }
        }
        setShowChat(current => !current);
        setUid(chatWith);
        setShowUsers(current => !current);
    }

    return (
        <>
            Messages:<br />
            {showUsers ?
                <>
                    {usersList.length > 0 ? (
                        usersList.map((user, index) => (
                            <div key={index} style={{ paddingBlockStart: '0.25em' }}>
                                <button className="user_list" onClick={() => handleClick(user.uid)}>
                                    {user.photoURL &&
                                        <img
                                            src={user.photoURL}
                                            style={{
                                                width: '2em',
                                                borderRadius: '1em',
                                                paddingBlock: '0.1em'
                                            }}
                                        />
                                    }
                                    {user.displayName}{user.read === 'sent' && <MdMarkChatUnread style={{ marginLeft: '0.5em' }} />}
                                </button>
                            </div>
                        ))
                    ) : <button className="user_list"><strong>No messagges</strong></button>}
                </>
                : <button className="back_button" onClick={() => handleClick({})}><BiArrowBack /></button>
            }
            {showChat && <LazyLoadingMessages uid={uid} read={true} />}
        </>
    )
}

export default MyChats