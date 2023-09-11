import React, { useState, useEffect } from 'react';
import { UserAuth } from '../Context/AuthContext';
import { useParams } from 'react-router-dom';
import { getDatabase, onChildAdded, ref } from "firebase/database";

function About(props) {
  const urlparams = useParams();
  const userID = urlparams.userID;

  const db = getDatabase();
  const usersRef = ref(db, '/users/'.concat(userID));
  useEffect(() => {
    onChildAdded(usersRef, (user) => {
      if (user.key === "about") {
        setText(user.val())
      }
    });
  }, []);

  const { user } = UserAuth();

  const [isEditable, setIsEditable] = useState(false);
  const [text, setText] = useState('no description provided ;(');
  const handleEdit = () => {
    setIsEditable(true);
  }

  const handleSave = () => {
    setIsEditable(false);
    fetch("/saveAbout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        about: text,
        uid: user.uid
      })
    })
  }

  const handleChange = (event) => {
    setText(event.target.value);
  }

  return (
    <div>
      {isEditable ? (
        <div>
          <textarea value={text} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p>{text}</p>
          {(user.uid === props.userID) && <button onClick={handleEdit}>Edit</button>}
        </div>
      )}
    </div>
  );
}

export default About;
