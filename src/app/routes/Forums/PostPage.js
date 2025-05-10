import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import BetterUNavbar from '../../../components/BetterUNavbar';
import Divider from '../../../components/Divider';
import Footer from '../../../components/Footer';
import BackToForumsButton from './BackToForumsButton';
import '../../../css/post_page.css';
import SavePostButton from './SavePostButton';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MDBContainer } from "mdb-react-ui-kit";


function correctCommentTime(dateString) {
    const inputDate = new Date(dateString);
    inputDate.setHours(inputDate.getHours() - 4);
    return inputDate.toLocaleString();
};

function PostPage() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const userId = JSON.parse(sessionStorage.getItem('user_info')).user_id;
    const role = JSON.parse(sessionStorage.getItem('user_info')).role;

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');

    const [selectedUser, setSelectedUser] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [showPopup, setShowPopup] = useState(false);

    const hasFetchedOnce = useRef(false);

    const handleSubmit = async () => {
        if (!commentText.trim()) return;

        const payload = {
            comment_text: commentText,
            post_id: postId,
            user_id: userId
        };

        try {
            const res = await fetch('/api/betteru/forum_comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to post comment');

            setCommentText('');
            fetchComments();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUsernameClick = useCallback((event, userId) => {
        event.stopPropagation();

        if (selectedUser && selectedUser.user_id === userId) {
            setShowPopup(false);
            setTimeout(() => setSelectedUser(null), 200);
            return;
        }

        requestAnimationFrame(async () => {
            const rect = event.target.getBoundingClientRect();
            const x = rect.left + window.scrollX;
            const y = rect.bottom + window.scrollY;

            try {
                const res = await fetch(`/api/betteru/users?user_id=${userId}`);
                if (!res.ok) throw new Error('Failed to fetch user info');
                const data = await res.json();
                const user = data.users[0];

                let numPostsOrComments = 0;
                const role = user.role;

                try {
                    if (role === 'patient') {
                        const commentsRes = await fetch(`/api/betteru/forum_comments?user_id=${userId}`);
                        if (!commentsRes.ok) throw new Error('Failed to fetch comments count');
                        const commentsData = await commentsRes.json();
                        numPostsOrComments = commentsData.forum_comments?.length || 0;
                    } else if (role === 'doctor') {
                        const postsRes = await fetch(`/api/betteru/forum_posts?user_id=${userId}`);
                        if (!postsRes.ok) throw new Error('Failed to fetch posts count');
                        const postsData = await postsRes.json();
                        numPostsOrComments = postsData.forum_posts?.length || 0;
                    }
                } catch (err) {
                    console.error('Failed to fetch post/comment counts:', err);
                    numPostsOrComments = 0;
                }


                setSelectedUser({
                    user_id: userId,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: role,
                    numPostsOrComments: numPostsOrComments,
                    created_at: user.created_at
                });
                setPopupPosition({ x, y });
                setShowPopup(true);
            } catch (err) {
                console.error('Failed to load user info:', err);
            }
        });
    }, [selectedUser]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/betteru/forum_posts?post_id=${postId}`);
            if (!res.ok) throw new Error('Failed to fetch post');
            const data = await res.json();
            if (data.forum_posts.length === 0) {navigate('/forums');}
            setPost(data.forum_posts[0]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/betteru/forum_comments?post_id=${postId}`);
            if (!res.ok) throw new Error('Failed to fetch comments');
            const data = await res.json();
            const baseComments = data.forum_comments || [];

            const updatedComments = await Promise.all(
                baseComments.map(async (comment) => {
                    try {
                        const userRes = await fetch(`/api/betteru/users?user_id=${comment.user_id}`);
                        if (!userRes.ok) throw new Error('Failed to fetch user info');
                        const userData = await userRes.json();
                        const user = userData.users[0];
                        return { ...comment, role: user.role };
                    } catch (err) {
                        console.error('Failed to fetch user for comment:', err);
                        return { ...comment, role: 'patient' };
                    }
                })
            );

            setComments(updatedComments);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!postId || hasFetchedOnce.current) return;
        hasFetchedOnce.current = true;
        fetchComments();
    }, [postId, comments]);

    useEffect(() => {
        if (!postId) return;
        fetchPost();
    }, [postId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const popup = document.getElementById('user-popup');
            if (popup && !popup.contains(event.target)) {
                setShowPopup(false);
                setTimeout(() => setSelectedUser(null), 200);
            }
        };

        if (selectedUser) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedUser]);

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <>
            <BetterUNavbar />

            {selectedUser && (
                <div
                    id="user-popup"
                    className={`user-popup ${showPopup ? 'fade-in' : 'fade-out'}`}
                    style={{
                        position: 'absolute',
                        top: popupPosition.y + 10,
                        left: popupPosition.x,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0px 2px 10px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        width: '240px',
                        transition: 'opacity 0.2s ease'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>
                            {selectedUser.role === 'doctor' ? 'Dr. ' : ''}
                            {selectedUser.first_name} {selectedUser.last_name}
                        </strong>
                        {selectedUser.role === 'doctor' && (
                            <span
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                }}
                            >
                                ✓
                            </span>
                        )}
                    </div>

                    <div style={{ marginTop: '8px' }}>
                        <b>Role:</b> {capitalize(selectedUser.role)}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        {selectedUser.role === 'patient'
                            ? `Comments: ${selectedUser.numPostsOrComments}`
                            : `Posts: ${selectedUser.numPostsOrComments}`}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        <b>Joined:</b> {new Date(selectedUser.created_at).toLocaleDateString()}
                    </div>
                </div>
            )}

                <MDBContainer className="p-3 my-5 d-flex flex-column w-100">
                <div className="post-header-buttons">
                    <BackToForumsButton />
                    {role === 'patient' && <SavePostButton userId={userId} postId={postId} />}
                </div>

                {loading && <p style={{ margin: '100px' }}>Loading post...</p>}
                {error && <p className="text-red-500" style={{ margin: '100px' }}>Error: {error}</p>}

                {post && (
                    <article className="post-header bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
                        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                        <div className="text-sm text-gray-500 mb-4">
                            Posted by Dr. {post.first_name} {post.last_name} <br />
                            {new Date(post.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-gray-800 whitespace-pre-wrap">{post.content}</div>

                        <div className="reply-container">
                            <input
                                type="text"
                                placeholder="Write a reply..."
                                className="reply-input"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button onClick={handleSubmit} className="reply-button">Reply</button>
                        </div>
                    </article>
                )}

                {comments.length > 0 && (
                    <section className="comment-section space-y-4">
                        {comments.map((comment) => (
                            <div
                                key={comment.comment_id}
                                className="border-l-4 border-gray-300 pl-4 py-3 bg-gray-50 rounded-md"
                            >
                                <div className="text-sm text-gray-600 mb-1">
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <b
                                            onClick={(e) => handleUsernameClick(e, comment.user_id)}
                                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            {comment.role === 'doctor' ? 'Dr. ' : ''}
                                            {comment.first_name || ''} {comment.last_name || 'Anonymous'}
                                        </b>
                                        {comment.role === 'doctor' && (
                                            <span
                                                style={{
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: '16px',
                                                    height: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                }}
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                    {' • '}
                                    {correctCommentTime(comment.created_at)}
                                </div>
                                <div className="text-gray-800">{comment.comment_text}</div>
                            </div>
                        ))}
                    </section>
                )}

                {comments.length === 0 && !loading && (
                    <p style={{ margin: '50px' }} className="text-gray-500 italic mt-6">
                        No comments yet. Be the first to comment!
                    </p>
                )}
            </MDBContainer>

            <Divider />
            <Footer />
        </>
    );
}

export default PostPage;
