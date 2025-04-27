import React from 'react';
import '../css/custom.css';

function DescriptionCard({ title, descrip, img }) {
    return (
      <div className="cards">        {/* make sure your parent uses .cards */}
        <div className="card">
          <img src={img} alt={title} />
          <p className="card-title">{title}</p>
          <p className="card-descrip">{descrip}</p>
        </div>
      </div>
    );
  }
  

export default DescriptionCard;
