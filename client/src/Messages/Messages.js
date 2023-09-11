import React, { useState, useRef, useEffect } from "react";
import { UserAuth } from "../Context/AuthContext";
import { getDatabase, ref, onChildAdded, onChildChanged, update } from "firebase/database";
import { AiOutlineSend } from 'react-icons/ai';

const Messages = (props) => {

  const { user } = UserAuth();

  const [conversation, setConversation] = useState([]);
  const db = getDatabase();
  const messagesRef = ref(db, '/messages');
  const [updateMessages, setUpdateMessages] = useState();

  useEffect(() => {
    setConversation([]);
    onChildAdded(messagesRef, (data) => {
      const user1 = data.key.substring(0, Math.floor(data.key.length / 2));
      const user2 = data.key.substring(Math.floor(data.key.length / 2));
      if ((user1 === user.uid && user2 === props.uid) || (user2 === user.uid && user1 === props.uid)) {
        data.forEach(message => {
          if (message.val().fromUid !== user.uid) {
            const readReceiptRef = ref(db, `/messages/${data.key}/${message.key}/`);
            update(readReceiptRef, { read: 'read' });
          }
          setConversation((conversation) => [...conversation, message.val()])
        })
      }
    })
    onChildChanged(messagesRef, (data) => {
      setUpdateMessages(data)
    })
  }, [updateMessages]);


  const inputRef = useRef(null);
  const SendMessage = () => {
    if (inputRef.current.value !== "") {
      fetch("/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUid: user.uid,
          fromDisplayName: user.displayName,
          to: props.uid,
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
        {conversation.map((message, index) => {
          const isSentByCurrentUser = message.fromUid === user.uid;
          const newMessageDate = new Date(message.timestamp).toLocaleDateString();
          const prevMessageDate = index > 0 ? new Date(conversation[index - 1].timestamp).toLocaleDateString() : null;
          const showDate = prevMessageDate !== newMessageDate;
          return (
            <div key={index}>
              {showDate && (<div style={{ textAlign: "center", marginBottom: "10px" }}>{newMessageDate}</div>)}
              <div className={isSentByCurrentUser ? "sent_message" : "received_message"}>
                {!isSentByCurrentUser && (
                  <><span style={{ fontSize: "12px", color: "grey" }}>{message.fromDisplayName}</span><br /></>
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: isSentByCurrentUser ? "flex-end" : "flex-start" }}>
                  <span style={{ marginBottom: "4px" }}>{message.message}</span>
                  <span style={{ fontSize: "12px", color: "grey", alignSelf: "flex-end" }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour12: false }).substring(0, 5)}
                    {isSentByCurrentUser && ' | '.concat(message.read)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <br />
      <div className="send_message_input">
        <textarea
          className="message"
          ref={inputRef}
          placeholder="message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              SendMessage();
            }
          }}
        />
        <button className="send_button" onClick={SendMessage}><AiOutlineSend /></button>
      </div>
    </>
  );
}

export default Messages;
