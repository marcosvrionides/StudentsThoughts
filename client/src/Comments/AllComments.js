import React, { useState, useEffect } from "react";
import { getDatabase, ref, onChildAdded } from "firebase/database";
import "./Comments.css";

const AllComments = (props) => {

    const db = getDatabase();
    const commentsRef = ref(db, '/comments/' + props.postID);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        onChildAdded(commentsRef, (snapshot) => {
            setComments((comments) => [...comments,
                {
                    commentID: snapshot.key,
                    commenter: snapshot.val().commenter,
                    comment: snapshot.val().comment,
                    date: snapshot.val().date
                }
            ]);
        })
    }, []);
    
    return (
        <div className="comment-section">
            {comments.map((AllComments, index) => {
                return (
                    <div className="comment" key={index}>
                        <span className="commenter">{AllComments.commenter}: </span>
                        <span className="comment-text">{AllComments.comment}</span>
                    </div>
                )
            })}
        </div>
    )



}

export default AllComments