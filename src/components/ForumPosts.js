import React, { useState, useEffect } from 'react';
import Divider from './Divider';
import ReactPaginate from 'react-paginate';
import '../css/forums.css';

function ForumPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    fetch('/forum_posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch forum posts');
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data.forum_posts); // updated to store the array directly
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
    if (loading) return <p>Loading forum posts...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
      <>
        <div className="posts-container">
          {currentPosts.map((post) => (
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

      <Divider />

      {displayPosts()}
    </>
  );
}

export default ForumPosts;
