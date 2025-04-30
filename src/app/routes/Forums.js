import { React, useState, useEffect } from 'react';
import '../../css/forums.css';
import BetterUNavbar from '../../components/BetterUNavbar';
import { Divider } from '@mui/material';
import Footer from '../../components/Footer';
import ForumPosts from './Forums/ForumPosts.js';
import { useNavigate } from 'react-router-dom';

function Forums() {
    const navigate = useNavigate();
    useEffect(()=>{
        fetch('/api/betteru/login_check', {
            method: 'GET',
            credentials: 'include',
            redirect: 'manual', /* Needed for login_check */
        }).then(resp => {
            console.log(resp.status);
            if(resp.status != 200) {
                alert("You need to be logged in to view the forums.");
                navigate('/log-in');
            }
        })
    }, []);
    return (
        <>
            <BetterUNavbar />

            <ForumPosts/>

            <Divider />
            <Footer />
        </>
    )
}

export default Forums;