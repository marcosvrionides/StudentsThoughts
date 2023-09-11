import React, { useState, useEffect } from "react"
import LazyLoadingMessages from "./LazyLoadingMessages.js";
import MyChats from "./MyChats";
import "./Messages.css";
import UserSearch from "../Search/UserSearch.js";
import MyGroupChats from "./MyGroupChats.js";
import { UserAuth } from "../Context/AuthContext.js";

function ChatList() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('isDarkMode');
    setIsDarkMode(storedDarkMode === 'true');
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const { user } = UserAuth();

  const [uid, setUid] = useState();
  const [showChat, setShowChat] = useState(false);
  const chatWith = (uid) => {
    setUid(uid);
    if (uid) {
      setshowBackButton(true);
      setShowChat(true);
    } else {
      setshowBackButton(false)
      setShowChat(false);
    }
  }

  const handleSelectedUser = (user) => {
    setShowMyChats(false);
    setShowMyGroupChats(false);
    chatWith(user.uid);
  }

  const [showBackButton, setshowBackButton] = useState(false);
  const handleBackButton = () => {
    setShowMyChats(true);
    setShowMyGroupChats(true);
    setUid(null);
    chatWith(null);
  }

  const [showMyChats, setShowMyChats] = useState(true)
  const toggleMyChats = (show) => {
    setShowMyChats(show)
  }

  const [showMyGroupChats, setShowMyGroupChats] = useState(true)
  const toggleMyGroupChats = (show) => {
    setShowMyGroupChats(show)
  }

  return (
    <>
      <div className="messages_container">
        {user.emailVerified ? (
          <>
            {showMyChats &&
              <>
                <div style={{ marginBottom: '1%' }}><UserSearch selectedUser={handleSelectedUser} /></div>
                <MyChats showMyGroupChats={toggleMyGroupChats} />
              </>
            }
            <hr />
            {showMyGroupChats &&
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingInline: '0.25em',
                  marginBottom: '0.25em'
                }}>
                  <>My groups:</>
                  <a href="/new_group_chat">
                    <button className="new_group_chat_button">+ New</button>
                  </a>
                </div>
                <div>
                  <MyGroupChats showMyChats={toggleMyChats} />
                </div>
              </>
            }
            {showBackButton && <button className="back_button" onClick={() => handleBackButton()}>Close</button>}
            {showChat && <LazyLoadingMessages uid={uid} />}
          </>
        ) : <strong>Please verify your email to send messages</strong>
        }
      </div>
    </>
  )
}

export default ChatList