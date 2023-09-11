import React, { useEffect, useState } from 'react';
import './Account.css';
import { useParams } from 'react-router-dom';
import Profile from '../Profile/Profile'
import { UserAuth } from '../Context/AuthContext';
import About from './About';
import { getDatabase, onChildAdded, ref } from "firebase/database";
import BackButton from '../BackButton/BackButton';

function Account() {
    const urlparams = useParams();
    const userID = urlparams.userID;
    const { user } = UserAuth();
    const [viewingUser, setViewingUser] = useState({});

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedDarkMode = localStorage.getItem('isDarkMode');
        setIsDarkMode(storedDarkMode === 'true');
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (user.uid === userID) {
            setViewingUser(user)
        } else {
            fetch('/searchUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchInput: userID
                })
            })
                .then(response => response.json())
                .then(response => {
                    setViewingUser(response[0])
                })
        }
    }, [])

    const db = getDatabase();
    const postsRef = ref(db, '/posts');
    const [viewingUserPosts, setViewingUserPosts] = useState([])
    useEffect(() => {
        onChildAdded(postsRef, (post) => {
            if (post.val().email === viewingUser.email) {
                setViewingUserPosts((viewingUserPosts) => [...viewingUserPosts, post.val()])
            }
        })
    }, [viewingUser])

    return (
        <div className='account_body'>
            <h1 className='accountBackButton'><BackButton /></h1>
            <Profile userID={userID} />
            <div className='about_posts_container'>
                <div className='about_master_container'>
                    <h1 className='heading'>About</h1>
                    <div className='users_about'>
                        <About userID={userID} />
                    </div>
                </div>
                <div className='posts_master_container'>
                    <h1 className='heading'>Posts</h1>
                    <div className='users_posts'>
                        {viewingUserPosts.map((viewingUserPosts, index) => (
                            <div key={index} className='post_container'>
                                <p>{viewingUserPosts.community}</p>
                                <h2>{viewingUserPosts.content}</h2>
                                <p>{viewingUserPosts.likes} likes</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account