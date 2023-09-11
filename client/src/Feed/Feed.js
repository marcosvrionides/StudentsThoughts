import LikeButton from '../Likes/LikeButton';
import React, { useState, useEffect, useRef } from "react"
import { getDatabase, ref, onChildAdded } from "firebase/database";
import { useParams } from 'react-router-dom';
import CommentSection from '../Comments/CommentSection';
import "./Feed.css"
import { UserAuth } from '../Context/AuthContext';
import PostSettings from '../PostSettings/PostSettings';
import { AiOutlineClose } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { CiMenuKebab } from 'react-icons/ci';

const Feed = () => {

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

    const db = getDatabase();
    const postsRef = ref(db, '/posts');
    const [posts, setPosts] = useState([]);
    const [postFiles, setPostFiles] = useState({});
    const urlparams = useParams();
    const { user } = UserAuth();

    useEffect(() => {
        onChildAdded(postsRef, (user) => {
            user.forEach(post => {
                if ((post.val().community === urlparams.community) || (urlparams.community === undefined)) {
                    var newChild = [
                        post.val().content,
                        post.val().email,
                        post.val().community,
                        post.ref.key,
                        post.val().likes,
                        post.val().file,
                        post.val().timestamp,
                        post.val().displayName,
                        post.val().uid
                    ]
                    setPosts((posts) => [newChild, ...posts])
                    setCommentsToggle(false);
                }
                if (post.val().file !== 'no file') {
                    fetch("/getFile", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ key: post.key })
                    })
                        .then(response => {
                            if (response.ok) {
                                return response.blob();
                            }
                            throw new Error("Failed to fetch file");
                        })
                        .then(blob => {
                            const url = URL.createObjectURL(blob);
                            setPostFiles(prevFiles => {
                                return { ...prevFiles, [post.key]: url }
                            })
                        })
                        .catch(error => {
                            console.error("Error fetching file:", error);
                        })
                }
            })

        })
    }, []);

    const [postIndex, setPostIndex] = useState();
    const [commentsToggle, setCommentsToggle] = useState(false);
    const commentSectionRef = useRef(null);
    const handleClick = (index) => {
        setPostIndex(index);
        setCommentsToggle((current) => (!current))
    }

    const [showSettings, setShowSettings] = useState("");
    const toggleSettings = (e) => {
        if (showSettings.length > 0) {
            setShowSettings("");
        } else {
            setShowSettings(e);
        }
    }

    const handlePostDelete = (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post[3] !== postId));
        setShowSettings("");
    };

    const [sortBy, setSortBy] = useState('Newest');

    if (posts.length > 0) {
        return (
            <>
                {user &&
                    <div className="sort_dropdown_container">
                        <button className="dropdown_button">Sort by: {sortBy}</button>
                        <div className="dropdown_content">
                            <button onClick={() => setSortBy('Likes')}>
                                {sortBy === 'Likes' ? ('> Likes') : ('Likes')}
                            </button>
                            <br />
                            <button onClick={() => setSortBy('Newest')}>
                                {sortBy === 'Newest' ? ('> Newest') : ('Newest')}
                            </button>
                        </div>
                    </div>
                }
                {posts.sort((a, b) => {
                    if (sortBy === 'Likes') {
                        return b[4] - a[4];
                    } else if (sortBy === 'Newest') {
                        return b[6] - a[6];
                    }
                }).map((AllPosts, index) => {
                    return (
                        <div key={index} className='feed'>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <div>
                                        {AllPosts[2] && <div className='postCommunity'>{AllPosts[2]}: </div>}
                                        <a className='poster_name' href={user ? '/account/'.concat(AllPosts[8]) : '/home'}>{AllPosts[7]}</a><br />
                                        <div style={{ fontSize: '14px', color: 'gray', marginBottom: '5px' }}>
                                            {new Date(AllPosts[6]).toLocaleString('en-GB', {
                                                timeZone: 'UTC',
                                                hour12: false,
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    {user && user.email === AllPosts[1] &&
                                        <button
                                            className='post_settings_button'
                                            onClick={() => toggleSettings(AllPosts[3])}
                                            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                                        >
                                            <CiMenuKebab />
                                        </button>}
                                </div>
                                <div className="postText">{AllPosts[0]}</div>
                                {(
                                    (
                                        AllPosts[5].endsWith('.jpg') ||
                                        AllPosts[5].endsWith('.jpeg') ||
                                        AllPosts[5].endsWith('.png')
                                    ) ? (
                                        <div className='postContentContainer'>
                                            <img
                                                className='postImageVideo'
                                                src={postFiles[AllPosts[3]]}
                                                alt="loading..."
                                            />
                                        </div>
                                    ) : (AllPosts[5].endsWith('.mp4') || AllPosts[5].endsWith('.webm') ? (
                                        <div className='postContentContainer'>
                                            <video
                                                className='postImageVideo'
                                                controls
                                                src={postFiles[AllPosts[3]]}
                                            />
                                        </div>
                                    ) : (AllPosts[5] !== 'no file') ? (
                                        <>
                                            <a href={postFiles[AllPosts[3]]} download={AllPosts[5]}>
                                                {AllPosts[5]}
                                            </a><br />
                                        </>
                                    ) : null
                                    )
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1em' }}>
                                    <div className='likes'><LikeButton postID={AllPosts[3]} userID={AllPosts[8]} /></div>
                                    <button className='comments_button' onClick={() => handleClick(index)}>
                                        <FaRegComment /> Comments
                                    </button>
                                </div>
                            </div>
                            {commentsToggle && index === postIndex &&
                                <div className='comments-master-container' ref={commentSectionRef}>
                                    <button className='close_comments_button' onClick={() => setCommentsToggle(!commentsToggle)}>
                                        <AiOutlineClose />
                                    </button>
                                    <CommentSection postID={AllPosts[3]} />
                                </div>
                            }

                            {showSettings === AllPosts[3] && (
                                <div style={{ backgroundColor: 'red', borderRadius: '1em', marginTop: '1%', padding: '1%' }}>
                                    <PostSettings postID={AllPosts[3]} onDelete={handlePostDelete} />
                                </div>
                            )}

                        </div>
                    )
                })}
            </>
        );
    } else {
        return (
            <div className='noPosts'>
                Its empty in here...
            </div>
        )
    }
}

export default Feed;