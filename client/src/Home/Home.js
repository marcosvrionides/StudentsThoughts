import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import NewPost from "../NewPost/NewPost.js";
import Navigationbar from "../NavigationBar/NavigationBar.js";
import Feed from "../Feed/LazyLoadingFeed";
import UserList from "../Messages/UserList.js";
import StickyBox from "react-sticky-box";
import CommunitiesSideBar from "../Communities/CommunitiesSideBar.js"
import Profile from "../Profile/Profile.js";
import "./Home.css";
import { UserAuth } from "../Context/AuthContext";
import CommunityDescription from "../Communities/Description/Description.js";
import { FiSettings } from 'react-icons/fi';

function Home() {

    const navigate = useNavigate()

    const { user } = UserAuth();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const setWindowDimensions = () => {
        setWindowWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener('resize', setWindowDimensions);
        return () => {
            window.removeEventListener('resize', setWindowDimensions)
        }
    }, []);

    const [toggle_left_sidebar, set_toggle_left_sidebar] = useState(false);
    const handleClick = () => {
        set_toggle_left_sidebar(!toggle_left_sidebar);
    }

    const [rerender, setRerender] = useState(false);
    const handleRerender = () => {
        setRerender(true);
    }

    return (
        <div className="home_body">
            {/*Header*/}
            <div className="NavigationBar">
                {user && <Navigationbar onChange={handleClick} />}
            </div>
            {/*Home page*/}
            <div style={{ display: "flex", justifyContent: 'center' }}>
                {windowWidth > 1000 && (
                    <>
                        {/*Left sidebar*/}
                        {user && <div className="leftSidebar">
                            <Profile userID={user.uid} />
                            <CommunitiesSideBar />
                        </div>}

                        {/*Middle part*/}
                        <div className="middlePart">
                            {/*New post*/}
                            {user &&
                                <StickyBox offsetTop={80} offsetBottom={'100vh'}>
                                    <NewPost onChange={handleRerender} />
                                </StickyBox>
                            }
                            {/*Feed*/}
                            <Feed />
                        </div>

                        {/*Right sidebar*/}
                        {user ?
                            <div className="rightSidebar">
                                <StickyBox offsetTop={100}>
                                    <UserList />
                                    <CommunityDescription />
                                </StickyBox>
                            </div>
                            :
                            <div className="loginSidebar">
                                Please <button onClick={() => navigate('/login')}>Sign In</button> to access the sites full feature set
                            </div>
                        }
                    </>
                )}

                {windowWidth <= 1000 && windowWidth > 600 && (
                    <>
                        {/*Left sidebar*/}
                        {user &&
                            <div className="leftSidebar">
                                <Profile userID={user.uid} />
                                <CommunitiesSideBar />
                                <UserList />
                            </div>
                        }

                        {/*Middle part*/}
                        <div className="middlePart">
                            {/*New post*/}
                            {user && <StickyBox offsetTop={80} offsetBottom={'100vh'}>
                                <NewPost onChange={handleRerender} />
                            </StickyBox>
                            }
                            {/*Feed*/}
                            <Feed />
                        </div>
                        {/*Login*/}
                        {!user &&
                            <div className="loginSidebar">
                                Please <button onClick={() => navigate('/login')}>Sign In</button> to access the sites full feature set
                            </div>
                        }
                    </>
                )}

                {windowWidth <= 600 && (
                    <>
                        {user &&
                            <div className={toggle_left_sidebar ? "smallScreenSidebar" : "hideSmallScreenSidebar"}>
                                <CommunitiesSideBar />
                                <UserList />
                                <div className="additional_buttons">
                                    <a href='/settings'><button id="settingsButton"><FiSettings /><> Settings</></button></a>
                                </div>
                                <br />
                            </div>
                        }
                        <div className={toggle_left_sidebar ? "hideSmallScreenHomepage" : "smallScreenHomepage"}>
                            {/*New post*/}
                            {user &&
                                <StickyBox offsetTop={70} offsetBottom={'100vh'}>
                                    <NewPost onChange={handleRerender} />
                                </StickyBox>
                            }
                            {/*Feed*/}
                            <Feed />
                        </div>
                        {!user &&
                            <div className="loginSidebar">
                                Please <button onClick={() => navigate('/login')}>Sign In</button> to access the sites full feature set
                            </div>
                        }
                    </>
                )}
            </div>
        </div>
    )
}

export default Home