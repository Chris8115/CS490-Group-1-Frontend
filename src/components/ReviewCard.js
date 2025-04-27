import React from 'react';
import '../css/custom.css'; // adjust if needed

const reviews = [
  {
    text: `BetterU was a huge help when I decided I wanted to lose weight. Now, I don’t have to say no to my kids when they want to play outside.`,
    avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp',
    name: 'Sallie Roberts',
  },
  {
    text: `The doctors on this site are absolutely amazing. The community has given me so many top exercise ideas that I’ve used.`,
    avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(15).webp',
    name: 'Jane Doe',
  },
  {
    text: `When I felt I wasn’t making progress, seeing my charts right there kept me focused and gave me the motivation I needed.`,
    avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(17).webp',
    name: 'Jill Hunts',
  },
];

export default function ReviewCard() {
  return (
    <div className="reviews-container">
      {reviews.map((r, i) => (
        <div className="review-item" key={i}>
          <p className="review-text">“{r.text}”</p>
          <div className="review-author">
            <img src={r.avatar} alt={r.name} className="review-avatar" />
            <div className="author-info">
              <p className="author-role">Name</p>
              <p className="author-name">{r.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
