// src/components/NavButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/custom.css'; // we'll define the custom styles here

function NavButton({ to, label, onClick }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (to) {
            navigate(to);
        }
    };

    return (
        <button className="nav-button" onClick={handleClick}>
            {label}
        </button>
    );
}

export default NavButton;
