import React from 'react';
import './PostSettings.css';

function PostSettings(props) {

  const postID = props.postID;
  const onDelete = props.onDelete;

  const deletePost = () => {
    onDelete(postID);
    fetch("/deletePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postID: postID })
    })
  }

  return (
    <button className='delete_button' onClick={deletePost}>Delete post</button>
  )
}

export default PostSettings;