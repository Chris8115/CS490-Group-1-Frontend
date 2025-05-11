import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackToForumsButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/forums')}
            className='btn btn-primary mb-4'
        >
            ← Back to Forums
        </button>
    );
}

export default BackToForumsButton;