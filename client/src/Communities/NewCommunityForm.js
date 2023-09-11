import React, { useRef, useState, useEffect } from "react";
import "./Communities.css"
import { UserAuth } from "../Context/AuthContext";
import { useNavigate } from 'react-router-dom'
import { getDatabase, ref, onChildAdded } from "firebase/database";
import BackButton from '../BackButton/BackButton.js'

function NewCommunityForm() {
    const { user } = UserAuth();
    const navigate = useNavigate()

    const db = getDatabase();
    const communitiesRef = ref(db, '/communities');
    const [communities, setCommunities] = useState([]);
    const [communityExists, setCommunityExists] = useState(false);

    useEffect(() => {
        onChildAdded(communitiesRef, (data) => {
            setCommunities((communities) => [...communities, data.val().name])
        })
    }, []);

    const handleCheckDuplicate = (e) => {
        setCommunityExists(communities.includes(e.target.value));
    };


    const communityName = useRef(null);
    const communityDescription = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (communityExists) {
            alert("This community name is already in use. Please choose a different name.")
        } else {
            fetch("/createCommuntiy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: communityName.current.value.trim(),
                    description: communityDescription.current.value.trim(),
                    creator: user.email
                })
            })
            e.target.reset();
            navigate('/home');
        }
    }

    return (
        <>
            <form className='new_community_form' onSubmit={handleSubmit}>
                <h1 style={{display: 'flex', gap: '1em'}}><BackButton />Create a new community</h1>
                <div className='form_element'>
                    <label style={{ marginRight: '1em' }} htmlFor='community_name_input'>Community name:</label>
                    <input
                        className={communityExists ? 'error' : ''}
                        ref={communityName}
                        id='community_name_input'
                        type={'text'}
                        placeholder='community name...'
                        onChange={(e) => handleCheckDuplicate(e)}
                    >
                    </input><br />
                    {communityExists ? <error className='error'>This community already exists*</error> : <></>}
                </div>
                <div className='form_element'>
                    <label style={{ marginRight: '1em' }} htmlFor='community_description_input'>Descriprion:</label>
                    <input
                        ref={communityDescription}
                        id='community_description_input'
                        type={'text'}
                        placeholder='description...'
                    >
                    </input>
                </div>

                <div className='form_element'>Created by: {user.email}</div>

                <div className='submit_form_button' align='right'><input type={'submit'} /></div>
            </form>
        </>
    )
}

export default NewCommunityForm