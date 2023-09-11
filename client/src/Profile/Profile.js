import React, { useState, useEffect, useRef } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import './Profile.css'
import { UserAuth } from '../Context/AuthContext'

const Profile = (props) => {

    const { user } = UserAuth();
    const userID = props.userID != undefined ? props.userID : user.uid;
    const currentUser = user.uid === userID;

    const db = getDatabase();
    const usersRef = ref(db, '/users/'.concat(userID));
    const [userProfile, setUserProfile] = useState({ displayName: '', email: '', about: '' });

    useEffect(() => {
        onValue(usersRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                setUserProfile({
                    displayName: userData.displayName || '',
                    email: userData.email || '',
                    about: userData.about || '',
                    photoURL: userData.profilePicture || ''
                });
            }
        });
    }, [userID]);

    const fileInputRef = useRef(null)
    const handleProfilePictureClick = () => {
        if (currentUser) {
            fileInputRef.current.click();
        }
    };

    const [profilePictureUrl, setProfilePictureUrl] = useState(userProfile.photoURL);

    useEffect(() => {
        setProfilePictureUrl(userProfile.photoURL)
    }, [userProfile])

    const handleProfilePictureUpload = (e) => {
        const profilePicture = e.target.files[0]
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        formData.append('uid', user.uid);
        fetch("/setProfilePicture", {
            method: "POST",
            body: formData
        })
    }

    return (
        <div className='profile_container'>
            <button className="profile_picture" onClick={handleProfilePictureClick}>
                {profilePictureUrl &&
                    <img
                        src={userProfile.photoURL}
                        alt='Profile'
                        referrerPolicy="no-referrer"
                    />}
            </button>
            <input
                type='file'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleProfilePictureUpload}
            />
            <hr style={{ width: "80%" }} />
            <p>{userProfile.displayName}</p>
        </div>
    )
}

export default Profile
