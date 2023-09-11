import './NavigationBar.css';
import React, { useState, useEffect, Component } from 'react';
import UserSearch from '../Search/UserSearch';
import { FiSettings, FiMenu } from 'react-icons/fi';

function Navigationbar(props) {

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

  const [toggle_left_sidebar, set_toggle_left_sidebar] = useState(false);
  const handleMenuButtonClick = () => {
    set_toggle_left_sidebar(!toggle_left_sidebar);
    props.onChange(toggle_left_sidebar);
  }

  const [accountUrl, setAccountUrl] = useState()
  const handleSelectedUser = (user) => {
    setAccountUrl('account/'.concat(user.uid))
  }

  return (
    <div className='navbar_container'>
      <a className='flex_child' id='home' href='/home'>
        <button className='homepage_button'>Home</button>
      </a>
      <a className='flex_child' id='search' href={accountUrl}>
        <UserSearch selectedUser={handleSelectedUser} />
      </a>
      <a className='flex_child' id='menu'>
        <button className='menu_button' onClick={handleMenuButtonClick}><FiMenu /></button>
      </a>
      <a className='flex_child' id='settings' href='/settings'>
        <button className='settings_button'><FiSettings /><br />Settings</button>
      </a>
    </div>
  );
}

export default Navigationbar;