import React, { useEffect, useState }from 'react';
import "./Description.css";
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onChildAdded } from "firebase/database";

function Description() {

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

  const urlparams = useParams();

  const db = getDatabase();
  const communitiesRef = ref(db, '/communities');

  const [description, setDescription] = useState(null)
  const [creator, setCreator] = useState(null)

  useEffect(() => {
    onChildAdded(communitiesRef, (data) => {
      if (data.val().name === urlparams.community) {
        setDescription(data.val().description)
        setCreator(data.val().creator)
      }
    })
  }, []);

  if (urlparams.community != null) {
    return (
      <div className='description_container'>
        <b id='description_name'>{urlparams.community}</b><br />
        <p id='description_content'>{description && ("Description: " + description)}</p><br />
        <small id='description_creator'>{creator && ("Community Made By: " + creator)}</small>
      </div>
    )
  } else {
    return (
      <></>
    )
  }
}

export default Description