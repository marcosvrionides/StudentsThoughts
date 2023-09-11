import React, { useState, useRef, useEffect } from "react";
import { UserAuth } from "../Context/AuthContext";
import { getDatabase, ref, onChildAdded, onChildChanged, update } from "firebase/database";
import { AiOutlineSend } from 'react-icons/ai';

const GroupMessages = (props) => {

    const { user } = UserAuth();

    const [conversation, setConversation] = useState([]);
    const db = getDatabase();
    const groupMessagesRef = ref(db, '/groupChats/'.concat(props.groupID).concat('/messages'));
    const [updateMessages, setUpdateMessages] = useState(false);

    useEffect(() => {
        setUpdateMessages(false)
        setConversation([]);
        onChildAdded(groupMessagesRef, (message) => {
            setConversation((prevConversation) => [...prevConversation, message.val()]);
        })
        onChildChanged(groupMessagesRef, () => {
            setUpdateMessages(true)
        })
    }, [updateMessages]);

    const inputRef = useRef(null);
    const SendMessage = () => {
        if (inputRef.current.value !== "") {
            fetch("/sendGroupMessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fromUid: user.uid,
                    fromDisplayName: user.displayName,
                    groupID: props.groupID,
                    message: inputRef.current.value
                })
            })
            inputRef.current.value = ""
        }
    }

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }, [conversation])

    return (
        <>
            <div className="chat_container" ref={messagesContainerRef}>
                {conversation.map((AllMessages, index) => {

                    const isSentByCurrentUser = AllMessages.fromUid === user.uid;
                    const newMessageDate = new Date(AllMessages.timestamp).toLocaleDateString();
                    const prevMessageDate = index > 0 ? new Date(conversation[index - 1].timestamp).toLocaleDateString() : null;
                    const showDate = prevMessageDate !== newMessageDate;

                    return (
                        <div key={index}>
                            {showDate && (<div style={{ textAlign: "center", marginBottom: "10px" }}>{newMessageDate}</div>)}
                            <div className={isSentByCurrentUser ? "sent_message" : "received_message"}>
                                {!isSentByCurrentUser && (
                                    <><span style={{ fontSize: "12px", color: "grey" }}>{AllMessages.fromDisplayName}</span><br /></>
                                )}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: isSentByCurrentUser ? "flex-end" : "flex-start" }}>
                                    <span style={{ marginBottom: "4px" }}>{AllMessages.message}</span>
                                    <span style={{ fontSize: "12px", color: "grey", alignSelf: "flex-end" }}>
                                        {new Date(AllMessages.timestamp).toLocaleTimeString([], { hour12: false }).substring(0, 5)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div><br />
            <div className="send_message_input">
                <textarea className="message" ref={inputRef} placeholder="message..." onKeyDown={(e) => { if (e.key === 'Enter') { SendMessage() } }} /> <button className="send_button" onClick={SendMessage} ><AiOutlineSend /></button >
            </div>
        </>
    )
}

export default GroupMessages