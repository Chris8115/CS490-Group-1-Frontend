import React, { useState, useEffect } from 'react';
import Divider from '../../../components/Divider';
import ReactPaginate from 'react-paginate';
import '../../../css/forums.css';
import Post from './Post.js';
import AddPost from './AddPost';
import SavedPosts from './SavedPosts.js';

function ForumPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  const userId = JSON.parse(sessionStorage.getItem('user_info')).user_id;
  const role = JSON.parse(sessionStorage.getItem('user_info')).role;

  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostText, setNewPostText] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    fetch('/api/betteru/forum_posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch forum posts');
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data.forum_posts);
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

  // Apply search + filter before pagination
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType ? post.post_type === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const offset = currentPage * postsPerPage;
  const currentPosts = filteredPosts.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(filteredPosts.length / postsPerPage);

  function displayPosts() {
    if (loading) return <p style={{ margin: '100px' }}>Loading forum posts...</p>;
    if (error) return <p style={{ margin: '100px' }}>Error: {error}</p>;

    return (
      <>
        <div className="posts-container">
          {currentPosts.map((post) => (
            <Post key={post.id} post={post} userId={userId} role={role} />
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

        {/* Search/Filter */}
        <div style={{ marginTop: '30px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center'}}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              width: '800px'
            }}
          />

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(0);
            }}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc'
            }}
          >
            <option value="">All Types</option>
            <option value="Discussion">Discussion Post</option>
            <option value="Exercise Plan">Exercise Plan</option>
          </select>
        </div>
      </div>

      {role === 'doctor' ? <AddPost userId={userId} /> : <SavedPosts />}
      <Divider />

      {displayPosts()}
    </>
  );
}

export default ForumPosts;
