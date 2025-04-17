import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackToForumsButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/forums')}
            style={{
                backgroundColor: '#F53D3E',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginBottom: '50px',
            }}
        >
            ← Back to Forums
        </button>
    );
}

export default BackToForumsButton;