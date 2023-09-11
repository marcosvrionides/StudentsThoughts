import React, { useState, useRef, useEffect } from "react";
import AllComments from "./AllComments";
import "./Comments.css";
import { UserAuth } from "../Context/AuthContext";

const CommentSection = (props) => {

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

    const inputRef = useRef(null);
    const [commentsUpdated, setCommentsUpdated] = useState(true);

    const SendComment = (event) => {

        event.preventDefault();

        if (inputRef.current.value !== "") {
            let date = new Date().toJSON();
            fetch("/sendComment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    displayName: user.displayName,
                    postID: props.postID,
                    comment: inputRef.current.value,
                    date: date
                })
            })
        }
        inputRef.current.value = "";

        setCommentsUpdated(false);
        setTimeout(() => setCommentsUpdated(true), 500);
    }

    return (
        <>
            {commentsUpdated ? <div className="comments-container"> <AllComments postID={props.postID} /> </div> : <p>Loading comments...</p>}
            {user &&
                <form onSubmit={SendComment} className="comment-form">
                    <input ref={inputRef} placeholder="comment..." className="comment-input" />
                    <button type="submit" className="comment-button">send</button>
                </form>
            }
        </>
    )
}

export default CommentSection