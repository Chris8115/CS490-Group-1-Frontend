import React, { useState, useEffect } from 'react';
import { isCompositeComponent } from 'react-dom/test-utils';
import { FaStar, FaRegStar } from 'react-icons/fa';

function SaveStarButton( { userId, postId } ) {
    // const userId = JSON.parse(sessionStorage.getItem('user_info')).user_id;
  
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if this post is already saved by the user
    fetch(`/api/betteru/saved_posts?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        const savedPostIds = data.saved_posts.map(post => post.post_id);
        setIsSaved(savedPostIds.includes(Number(postId)));

      })
      .catch(err => console.error('Error fetching saved posts:', err));
  }, [postId, userId]);

  const handleClick = () => {

    const payload = {
      post_id: postId,
      user_id: userId
    };

    if (!isSaved) {
        fetch('/api/betteru/saved_posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
          })
          .then(res => {
            if (res.ok) {
              setIsSaved(true);
            } else {
              throw new Error('Failed to save post');
            }
          })
          .catch(err => {
            console.error('Error saving post:', err);
          });
    }
    else {
        fetch('/api/betteru/saved_posts', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
          })
          .then(res => {
            if (res.ok) {
              setIsSaved(false);
            } else {
              throw new Error('Failed to unsave post');
            }
          })
          .catch(err => {
            console.error('Error saving post:', err);
          });
    }

    
  };

  return (
    <button className={`save-star-button ${isSaved ? 'saved' : ''}`} onClick={handleClick}>
      {isSaved ? <FaStar /> : <FaRegStar />}
    </button>
  );
}

export default SaveStarButton;
