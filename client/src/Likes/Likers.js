import React, { useEffect, useState } from 'react'
import './Likes.css'

const Likers = (props) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        for (let liker = 0; liker < props.likers.length; liker++) {
            fetch("/searchUsers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    searchInput: props.likers[liker]
                })
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .then((data) => {
                    setUsers((users) => [...users, data[0]]);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [])

    return (
        <>
            Liked by:<hr />
            {
                users.map((user, index) => {
                    return (
                        <div key={index}><strong>{user.displayName}</strong><hr /></div>
                    )
                })
            }
        </>
    )
}

export default Likers