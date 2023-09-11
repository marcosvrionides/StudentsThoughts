import React, { useState, useEffect } from "react";
import { getDatabase, ref, onChildAdded } from "firebase/database";
import { UserAuth } from "../Context/AuthContext";
import '../App.css';
import { AiOutlineHeart } from 'react-icons/ai';
import { FcLike } from 'react-icons/fc';
import Likers from './Likers';
import { AiOutlineClose } from 'react-icons/ai';

const LikeButton = (props) => {

  const { user } = UserAuth();

  const db = getDatabase();
  const likesRef = ref(db, '/likes/' + props.postID);
  const [likes, setLikes] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [likers, setLikers] = useState([])

  useEffect(() => {
    setLikers([]);
    setIsClicked(false);
    onChildAdded(likesRef, (snapshot) => {
      if (snapshot.val().like) {
        setLikers((likers) => [...likers, snapshot.key])
      }
      if (snapshot.key === user.uid) {
        setIsClicked(snapshot.key);
      }
    })
  }, [props, likes]);

  useEffect(() => {
    setLikes(likers.length)
  }, [likers])

  const handleLike = () => {
    fetch("/setLike", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: props.userID,
        postID: props.postID,
        like: isClicked ? false : true
      })
    })
      .then(res => res.json())
      .then(res2 => setLikes(res2.likes))
    setIsClicked(!isClicked);
  }

  const [showLikers, setShowLikers] = useState(false)

  return (
    <>
      {user &&
        <button className="like_button" onClick={handleLike}>
          {isClicked ? <FcLike /> : <AiOutlineHeart />}
        </button>
      }
      <button className="like_button" onClick={() => setShowLikers(!showLikers)}>
        {likes}
        {likes === 1
          ? <> Like</>
          : <> Likes</>}
      </button>
      {showLikers &&
        <div className="likers_master_container">
          <button className='close_like_button' onClick={() => setShowLikers(!showLikers)}><AiOutlineClose /></button>
          <Likers likers={likers} />
        </div>
      }
    </>
  );
};

export default LikeButton;