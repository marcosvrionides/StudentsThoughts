import React from 'react'
import { useNavigate } from 'react-router-dom';
import './BackButton.css'
import { AiOutlineArrowLeft } from 'react-icons/ai'

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button className='backButton' type='button' onClick={handleBack}>
            <AiOutlineArrowLeft />
        </button>
    );
}

export default BackButton