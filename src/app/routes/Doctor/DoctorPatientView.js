import { React, useState, useEffect } from 'react';
import BetterUNavbar from '../../../components/BetterUNavbar';
import Divider from '../../../components/Divider';
import Footer from '../../../components/Footer';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';


function DoctorPatientView() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const postsPerPage = 10;

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
      };
    
      const offset = currentPage * postsPerPage;
      const currentPosts = posts.slice(offset, offset + postsPerPage);
      const pageCount = Math.ceil(posts.length / postsPerPage);
      
      useEffect(() => {
          fetch('http://localhost:5000/doctor_patient_relationship')
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

        console.log(posts);

      function displayPatients() {
        if (loading) return <p>Loading patients...</p>;
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
            <BetterUNavbar />
            <div className='patient-list'>
                {displayPatients()}
            </div>
            <Divider />
            <Footer />

        </>
    )
}

export default DoctorPatientView;