import React from 'react';
import { useNavigate } from 'react-router-dom';

function Post({ post }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/post/${post.post_id}`);
    };

    return (
        <div onClick={handleClick} className="post-card cursor-pointer" key={post.post_id}>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-type">Dr. {post.first_name} {post.last_name}</p>
            <small className="post-date">
                {new Date(post.created_at).toLocaleDateString()}
            </small>
        </div>
    );
}

export default Post;
