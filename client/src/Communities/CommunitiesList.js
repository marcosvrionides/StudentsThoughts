import React, { useState, useEffect } from "react";
import { getDatabase, ref, onChildAdded } from "firebase/database";
import "./Communities.css"

function CommunitiesList() {

    const db = getDatabase();
    const communitiesRef = ref(db, '/communities');
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        onChildAdded(communitiesRef, (data) => {
            setCommunities((communities) => [data.val().name, ...communities])
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

    return (
        <>
            New Communities
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '0.25em'
            }}>
                {noDuplicatesCommunities.slice(0, 4).map((AllCommunities, index) => {
                    const url = "/home/".concat(AllCommunities);
                    return (
                        <a key={index} href={url}>
                            <button className="communities_list">{AllCommunities}</button>
                        </a>
                    );
                })}
            </div>
        </>
    )
}

export default CommunitiesList