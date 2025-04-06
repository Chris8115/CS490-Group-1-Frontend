import React from 'react';
import '../css/custom.css';

function DescriptionCard( {title, descrip, img} ) {
    return (
        <div className="card">
            <img src={img} height="auto" width="auto"></img>
                
            <p className="card-title">{title}</p>
            <p className="card-descrip">{descrip}</p>
        </div>
    )
}

export default DescriptionCard;