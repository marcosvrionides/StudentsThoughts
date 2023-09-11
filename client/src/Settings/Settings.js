import React, { useState, useEffect } from 'react';
import './Settings.css';
import { UserAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '../BackButton/BackButton';

function Settings() {
    const { user } = UserAuth();

    const navigate = useNavigate()
    useEffect(() => {
        if (user === null) {
            navigate('/login');
        }
    }, [user])

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedDarkMode = localStorage.getItem('isDarkMode');
        setIsDarkMode(storedDarkMode === 'true');
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleSetDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        localStorage.setItem('isDarkMode', !isDarkMode)
    }

    const { logOut } = UserAuth();

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    }

    if (user !== null) {
        return (
            <div className='settings_body'>
                <h1 className='title'><BackButton/>Settings</h1>
                <div className='settings_container'>
                    <a href={'/account/'.concat(user.uid)}><button className='item'>Profile</button></a><br />
                    <button className='item' onClick={() => handleSignOut()}>Logout</button>
                    <button className='item' id='darkmode_toggle' onClick={() => handleSetDarkMode()}>
                        <div>Dark Mode</div> <div>{isDarkMode ? ( 'on' ) : 'off'}</div>
                    </button><br />
                </div>
            </div>
        );
    }
}

export default Settings;
