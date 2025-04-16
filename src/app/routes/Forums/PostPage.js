import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BetterUNavbar from '../../../components/BetterUNavbar';
import Divider from '../../../components/Divider';
import Footer from '../../../components/Footer';
import '../../../css/post_page.css';


function PostPage() {
    const location = useLocation();
    const postId = location.state?.postId;
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch post
    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost:5000/forum_posts?post_id=${postId}`);
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

    // Fetch comments
    useEffect(() => {
        if (!postId) return;

        const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:5000/forum_comments?post_id=${postId}`);
                if (!res.ok) throw new Error('Failed to fetch comments');
                const data = await res.json();
                setComments(data.forum_comments || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchComments();
    }, [postId]);

    return (
        <>
            <BetterUNavbar />
            <Divider />

            <main className="p-6 max-w-3xl mx-auto">
                {loading && <p>Loading post...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {post && (
                    <article className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
                        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                        <div className="text-sm text-gray-500 mb-4">
                            Posted by Dr. {post.first_name} {post.last_name} •{' '}
                            {new Date(post.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-gray-800 whitespace-pre-wrap">{post.content}</div>
                    </article>
                )}

                {/* Comments Section */}
                {comments.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold mb-2">Comments</h2>
                        {comments.map((comment) => (
                            <div
                                key={comment.comment_id}
                                className="border-l-4 border-gray-300 pl-4 py-3 bg-gray-50 rounded-md"
                            >
                                <div className="text-sm text-gray-600 mb-1">
                                    {comment.username || 'Anonymous'} •{' '}
                                    {new Date(comment.created_at).toLocaleString()}
                                </div>
                                <div className="text-gray-800">{comment.content}</div>
                            </div>
                        ))}
                    </section>
                )}

                {comments.length === 0 && !loading && (
                    <p className="text-gray-500 italic mt-6">No comments yet. Be the first to comment!</p>
                )}
            </main>

            <Footer />
        </>
    );
}

export default PostPage;
