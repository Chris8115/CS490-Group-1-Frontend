import  { React, useState, useEffect } from 'react';
import Divider from './Divider';

function ForumPosts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/forum_posts')
        .then((res) => {
            if (!res.ok) {
            throw new Error('Failed to fetch forum posts');
            }
            return res.json();
        })
        .then((data) => {
            setPosts(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    function displayPosts() {
        if (loading) return <p>Loading forum posts...</p>;
        if (error) return <p>Error: {error}</p>;
      
        return (
          <div className="posts-container">
            {posts.forum_posts.map((post) => (
              <div key={post.post_id} className="post-card">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-type">{post.post_type}</p>
                <p className="post-content">{post.content}</p>
                <small className="post-date">
                  Posted on {new Date(post.created_at).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        );
      }
      
    


    return (
        <>
            <div className='content'>
                <h1>Discussion Forums</h1>
            </div>

            <Divider />

            {displayPosts()}
        </>
    )
}

export default ForumPosts;