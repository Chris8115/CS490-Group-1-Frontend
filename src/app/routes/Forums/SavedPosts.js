import React, { useEffect, useState } from 'react';
import '../../../css/saved_posts.css';
import { Link } from 'react-router-dom';

function SavedPosts() {
    const [showModal, setShowModal] = useState(false);
    const [savedPosts, setSavedPosts] = useState([]);
    const userId = JSON.parse(sessionStorage.getItem('user_info')).user_id;

    useEffect(() => {
        

        if (showModal) {

            fetch(`/api/betteru/saved_posts?user_id=${userId}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch saved posts');
                    return res.json();
                })
                .then(data => setSavedPosts(data.saved_posts || []))
                .catch(err => console.error('Error fetching saved posts:', err));

                console.log(userId);

        }
    }, [showModal, userId]);

    return (
        <>
            <button
                className="view-saved-posts-button"
                onClick={() => setShowModal(true)}
            >
                View Saved Posts
            </button>

            {showModal && (
                <div className="saved-posts-overlay">
                    <div className="saved-posts-modal">
                        <h2 className="modal-title">Saved Posts</h2>
                        <ul className="saved-posts-list">
                            {savedPosts.map((post) => (
                                <li key={post.post_id} className="saved-post-item">
                                    <Link to={`/post/${post.post_id}`} className="saved-post-link">
                                        {post.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <button
                            className="close-button"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default SavedPosts;
