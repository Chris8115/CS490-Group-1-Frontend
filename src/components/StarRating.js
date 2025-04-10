import React, { useState } from 'react';

const StarRating = ({ totalStars = 5, onRatingChange }) => {
  const [rating, setRating] = useState(0);

  // Handle clicking on a star
  const handleClick = (index) => {
    setRating(index);
    if (onRatingChange) {
      onRatingChange(index); // Callback to parent component with the rating
    }
  };

  // Render the stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleClick(i)}
          style={{
            cursor: 'pointer',
            color: i <= rating ? '#FFD700' : '#ddd', // Gold color for selected
            fontSize: '30px',
          }}
        >
          &#9733; {/* Unicode for a star */}
        </span>
      );
    }
    return stars;
  };

  return <div>{renderStars()}</div>;
};

export default StarRating;
