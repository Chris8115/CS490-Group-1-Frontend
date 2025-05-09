import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../css/custom.css';
import { useNavigate } from 'react-router-dom';

function PharmacyNavbar() {

  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem('user_info');

  let buttons;

  const handleLogout = async () => {
    try {
        const response = await fetch('/api/pharmacy/logout', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            sessionStorage.clear();
            navigate('/pharmacy-log-in');
        } else {
            console.error('Logout failed');
        }
    } catch (err) {
        console.error('Error during logout:', err);
    }
};

  if (!isLoggedIn) {
    buttons = (
                <>

                  <Nav.Link href="/pharmacy-log-in">Log In</Nav.Link>
                </>
                )
  }
  else {
    buttons = (
      <>
        <Nav.Link onClick={handleLogout} >Logout</Nav.Link>
        <Nav.Link href="/pharmacy/dashboard">Dashboard</Nav.Link>
      </>
      )
  }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary pharmacy-navbar">
        <Container>
          <Navbar.Brand href="/pharmacy/dashboard">BigPharma</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav float-center">
            <Nav className="ms-auto">
              {buttons}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
    
  );
}
  
export default PharmacyNavbar;
