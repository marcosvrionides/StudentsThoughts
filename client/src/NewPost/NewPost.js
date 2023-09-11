import React, { useState, useEffect } from "react";
import "./NewPost.css"
import { getDatabase, ref, onChildAdded } from "firebase/database";
import { UserAuth } from "../Context/AuthContext";

const NewPost = (props) => {

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

    const [content, setContent] = useState(""); //content inputed by user
    const [communitySelection, setCommunitySelection] = useState(""); //community selected by user
    const [communityInput, setCommunityInput] = useState(""); //community inputed by user
    const [charsLeft, setCharsLeft] = useState(200);

    const db = getDatabase();
    const communitiesRef = ref(db, '/communities');
    const [communities, setCommunities] = useState([]);

    useEffect(() => {
        setCharsLeft(200 - content.length)
    }, [content])

    useEffect(() => {
        onChildAdded(communitiesRef, (data) => {
            setCommunities((communities) => [...communities, data.val().name])
        })
    }, []);

    var searchedCommunities = [];
    const [cleanedSearchedCommunities, setCleanedSearchedCommunities] = useState([]);
    const searchCommunities = (e) => {
        setCommunitySelection("");
        setCommunityInput(e.target.value);
        searchedCommunities = [];
        for (let i = 0; i < communities.length; i++) {
            if (communities[i].toLowerCase().includes((e.target.value).toLowerCase())) {
                searchedCommunities = [...searchedCommunities, communities[i]]
            }
        }
        setCleanedSearchedCommunities([]);
        for (let i = 0; i < searchedCommunities.length; i++) {
            setCleanedSearchedCommunities((cleanedSearchedCommunities) => [...cleanedSearchedCommunities, searchedCommunities[i]])
        }
    }

    const formData = new FormData();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content === "") {
            alert("Please write something...")
        } else {
            const formData = new FormData();
            formData.append("content", JSON.stringify({
                email: user.email,
                displayName: user.displayName,
                uid: user.uid,
                content: content,
                community: communitySelection
            }));
            if (document.getElementById("file_input").files[0]) {
                formData.append("uploadedFile", document.getElementById("file_input").files[0]);
            }
            fetch("/newPost", {
                method: "POST",
                body: formData
            })
                .then(() => {
                    setContent("");
                    setCommunitySelection("");
                    setCommunityInput("");
                    handleDeleteFile();
                    props.onChange(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const handleDeleteFile = () => {
        setDeleteFileButton(false);
        document.getElementById("file_input").value = null;
        formData.delete("uploadedFile");
    }

    const [deleteFileButton, setDeleteFileButton] = useState(false);
    const handleFileInput = (e) => {
        const file = e.target.files[0];
        const fileType = file.type.split("/")[0];

        if (file.size > 1048576 * 240) {
            handleDeleteFile();
            alert("File too large. Max size 240MB.");
        } else if (fileType === "image" || fileType === "video") {
            formData.append("uploadedFile", file);
            setDeleteFileButton(true);
        } else {
            handleDeleteFile();
            alert("Only photos and videos are allowed.");
        }
    }


    const removeCommunityInput = () => {
        setCommunitySelection("");
    }

    if (charsLeft === 200) {
        return (
            <>
                <div className='post_container'>
                    {user.emailVerified ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <textarea className='post_content' placeholder="Say something..." type="text" maxLength={200} value={content} onChange={(e) => setContent(e.target.value)} />
                                <div className='chars_left'>{charsLeft}/200 Characters left</div>
                            </div>
                        </form>
                    ) : <strong>Please verify your email to make posts</strong>
                    }
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className='post_container'>
                    {user.emailVerified ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <textarea
                                    className='post_content'
                                    placeholder="Say something..."
                                    type="text"
                                    maxLength={200}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <div className='chars_left'>{charsLeft}/200 Characters left</div>
                                <div>
                                    <input
                                        className='community_input'
                                        placeholder="Add to community... (optional)"
                                        type="text"
                                        maxLength={60}
                                        value={communityInput}
                                        onChange={searchCommunities}
                                    />

                                </div>
                                {communityInput.length > 0 &&
                                    <>
                                        <div style={{ display: 'flex', gap: '1em' }}>
                                            Select:
                                            {communitySelection.length > 0 &&
                                                <div className="slectedCommunity">
                                                    <text id="name">{communitySelection}</text>
                                                    <button
                                                        className="deleteSelectedCommunityButton"
                                                        type="button"
                                                        onClick={() => removeCommunityInput()}>
                                                        X
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                        <div className='community_dropdown_container'>
                                            {cleanedSearchedCommunities.map((AllCommunities, index) => {
                                                return (
                                                    <div key={index}>
                                                        <button
                                                            className={"communities_dropdown"}
                                                            type="button"
                                                            onClick={() => {
                                                                setCommunitySelection(AllCommunities)
                                                            }}
                                                        >
                                                            {AllCommunities}
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </>
                                }<br />
                                <div className="file-post">
                                    <input className="file_input" id="file_input" type="file" onChange={handleFileInput} />
                                    {deleteFileButton && <button className="remove_inputed_file_button" type="button" onClick={handleDeleteFile}>X</button>}
                                    <input className='post_button' type="submit" value={"Post"}></input>
                                </div>
                            </div>
                        </form>
                    ) : <strong>Please verify your email to make posts</strong>
                    }
                </div>
            </>
        )
    }

}

export default NewPost
