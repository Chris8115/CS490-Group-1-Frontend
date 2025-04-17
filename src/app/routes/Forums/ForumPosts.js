import React, { useState, useEffect } from 'react';
import Divider from '../../../components/Divider';
import ReactPaginate from 'react-paginate';
import '../../../css/forums.css';
import Post from './Post.js';
import AddPost from './AddPost';


function ForumPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = JSON.parse(sessionStorage.getItem('user_info')).user_id;
  const role = JSON.parse(sessionStorage.getItem('user_info')).role;

  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostText, setNewPostText] = useState('');

  // pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:5000/forum_posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch forum posts');
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data.forum_posts); // updated to store the array directly
        console.log(posts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * postsPerPage;
  const currentPosts = posts.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(posts.length / postsPerPage);

  function displayPosts() {
    if (loading) return <p style={{
                                margin: '100px'
                            }} >Loading forum posts...</p>;
    if (error) return <p style={{
                              margin: '100px'
                          }}>Error: {error}</p>;

    return (
      <>
        <div className="posts-container">
          {currentPosts.map((post) => (
            <Post post={post} />
          ))}
        </div>

        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel="< Prev"
          containerClassName="pagination"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
        />
      </>
    );
  }

  return (
    <>
      <div className="content">
        <h1>Discussion Forums</h1>
      </div>

      <AddPost userId={userId} />
      <Divider />

      {displayPosts()}
    </>
  );
}

export default ForumPosts;
