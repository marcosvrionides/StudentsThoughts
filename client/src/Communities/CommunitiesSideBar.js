import React, { useState, useEffect } from "react";
import { getDatabase, ref, onChildAdded } from "firebase/database";
import CommunitiesList from "./CommunitiesList";
import "./Communities.css"
import { UserAuth } from "../Context/AuthContext.js";

const CommunitiesSideBar = () => {

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
    const communitiesRef = ref(db, '/communities');
    const [communities, setCommunities] = useState([]);

    const { user } = UserAuth();

    useEffect(() => {
        onChildAdded(communitiesRef, (data) => {
            setCommunities((communities) => [...communities, data.val().name])
        })
    }, []);

    var noDuplicatesCommunities = [];
    var index = 0;
    for (let i = 0; i < communities.length; i++) {
        if (!noDuplicatesCommunities.includes(communities[i])) {
            noDuplicatesCommunities[index] = communities[i]
            index++;
        }
    }

    var searchedCommunities = [];
    const [showAllCommunities, setShowAllCommunities] = useState(true);
    const [cleanedSearchedCommunities, setCleanedSearchedCommunities] = useState([]);
    const searchCommunities = (e) => {
        if (e.target.value.length > 0) {
            setShowAllCommunities(false);
            searchedCommunities = [];
            for (let i = 0; i < noDuplicatesCommunities.length; i++) {
                if (noDuplicatesCommunities[i].toLowerCase().includes((e.target.value).toLowerCase())) {
                    searchedCommunities = [...searchedCommunities, noDuplicatesCommunities[i]]
                }
            }
            setCleanedSearchedCommunities([]);
            for (let i = 0; i < searchedCommunities.length; i++) {
                setCleanedSearchedCommunities((cleanedSearchedCommunities) => [...cleanedSearchedCommunities, searchedCommunities[i]])
            }
        } else {
            setShowAllCommunities(true);
            setCleanedSearchedCommunities([]);
        }
    }

    return (
        <>
            <div className="communities_container">
                <input className="search_bar" type="text" placeholder="Search communities..." onChange={searchCommunities}></input><br />
                {user.emailVerified && <><a href="/new_community"><button className="new_community_button">+ Create new</button></a> <br /></>}
                {showAllCommunities && <CommunitiesList />}
                {cleanedSearchedCommunities.map((AllCommunities, index) => {
                    const url = "/home/".concat(AllCommunities);
                    return (
                        <>
                            <a key={index} href={url}><button className={showAllCommunities ? "communities_list" : "show_all_communities_list"}>{AllCommunities}</button></a>
                        </>
                    )
                })}
            </div>
        </>
    )
}

export default CommunitiesSideBar
