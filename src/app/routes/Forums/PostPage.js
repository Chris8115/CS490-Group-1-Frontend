import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import BetterUNavbar from '../../../components/BetterUNavbar';
import Divider from '../../../components/Divider';
import Footer from '../../../components/Footer';
import BackToForumsButton from './BackToForumsButton';
import '../../../css/post_page.css';
import SavePostButton from './SavePostButton';
import { useParams } from 'react-router-dom';

function PostPage() {
    const { postId } = useParams()
    const userId = JSON.parse(sessionStorage.getItem('user_info')).user_id;
    const role = JSON.parse(sessionStorage.getItem('user_info')).role;

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');

    const hasFetchedOnce = useRef(false); // prevents infinite loop in useEffect below


    const handleSubmit = async () => {
        if (!commentText.trim()) return;
    
        const payload = {
            comment_text: commentText,
            post_id: postId,
            user_id: userId
        };
    
        try {
            const res = await fetch('/forum_comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
    
            if (!res.ok) throw new Error('Failed to post comment');
    
            setCommentText(''); // Clear input
    
            // Re-fetch comments after posting
            fetchComments(); 
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Fetch post
    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/betteru/forum_posts?post_id=${postId}`);
                if (!res.ok) throw new Error('Failed to fetch post');
                const data = await res.json();
                setPost(data.forum_posts[0]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/betteru/forum_comments?post_id=${postId}`);
            if (!res.ok) throw new Error('Failed to fetch comments');
            const data = await res.json();
            setComments(data.forum_comments || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch comments initially and when setComments changes them
    useEffect(() => {
        if (!postId || hasFetchedOnce.current) return;
        hasFetchedOnce.current = true;

        fetchComments();
    }, [postId, comments]);

    useEffect(() => {
        if (!postId) return;
        fetchComments();
    }, [postId]);

    return (
        <>
            <BetterUNavbar />

            

            <main className="p-6 max-w-3xl mx-auto post-page">
                
            <div className="post-header-buttons">
                <BackToForumsButton />
                {role === 'patient' && <SavePostButton userId={userId} postId={postId} />}
            </div>
                
                {loading && <p style={{
                                margin: '100px'
                            }}>Loading post...</p>}
                {error && <p className="text-red-500" style={{
                                margin: '100px'
                            }}>Error: {error}</p>}

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
                                    <b>{comment.first_name || ''} {comment.last_name || 'Anonymous'} </b> •{' '}
                                    {new Date(comment.created_at).toLocaleString()}
                                </div>
                                <div className="text-gray-800">{comment.comment_text}</div>
                            </div>
                        ))}
                    </section>
                )}

                {comments.length === 0 && !loading && (
                    <p style={{
                        margin: '50px'
                    }} className="text-gray-500 italic mt-6">No comments yet. Be the first to comment!</p>
                )}
            </main>

            <Divider />
            <Footer />
        </>
    );
}

export default PostPage;
