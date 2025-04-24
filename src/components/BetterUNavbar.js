import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../css/custom.css';
import { useNavigate } from 'react-router-dom';

function BetterUNavbar() {

  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem('user_info');

  let buttons;

  const handleLogout = async () => {
    try {
        const response = await fetch('/api/betteru/logout', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            sessionStorage.clear();
            navigate('/log-in');
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
                  <Nav.Link href="/home">Home</Nav.Link>
                  <Nav.Link href="/sign-up">Sign Up</Nav.Link>
                  <Nav.Link href="/log-in">Log In</Nav.Link>
                </>
                )
  }
  else {
    buttons = (
      <>
        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        <Nav.Link href="/forums">Discussion Forums</Nav.Link>
        <Nav.Link onClick={handleLogout} >Logout</Nav.Link>
      </>
      )
  }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary navbar">
        <Container>
          <Navbar.Brand href="/">BetterU</Navbar.Brand>
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
  
  export default BetterUNavbar;
