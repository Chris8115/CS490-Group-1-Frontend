import { useState } from 'react';
import '../../../css/add_post.css';
import { useNavigate } from 'react-router-dom';

function AddPost({ userId }) {
    const [showModal, setShowModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostText, setNewPostText] = useState('');
    const [postType, setPostType] = useState('Discussion');
    const [newPostId, setNewPostId] = useState();
    const navigate = useNavigate();


    const handleSubmit = async () => {
        if (!newPostTitle.trim() || !newPostText.trim()) return;

        const payload = {
            title: newPostTitle,
            content: newPostText,
            post_type: postType,
            user_id: JSON.parse(sessionStorage.getItem('user_info')).user_id
        };

        try {
            console.log(payload);
            const res = await fetch(`/api/betteru/forum_posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error('Failed to create post');
            }

            const data = await res.json();

            setShowModal(false);
            setNewPostTitle('');
            setNewPostText('');
            setPostType('Discussion');

            navigate(`/post/${data.id}`, { state: { postId: data.id } });

        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="btn btn-success create-post-button"
            >
                <span className="plus-icon">＋</span>
                <span className="create-text">Create Post</span>
            </button>

            {showModal && (
                <div className="create-post-overlay">
                    <div className="create-post-modal">
                        <h2 className="modal-title">Create New Post</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            className="modal-input"
                        />

                        <select
                            value={postType}
                            onChange={(e) => setPostType(e.target.value)}
                            className="modal-dropdown"
                            >
                            <option value="Discussion">Discussion</option>
                            <option value="Exercise Plan">Exercise Plan</option>
                        </select>

                        <textarea
                            placeholder="Write your post here..."
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            className="modal-textarea"
                        />


                        <div className="modal-buttons">
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-danger"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="btn btn-success"
                            >
                                Submit Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddPost;
