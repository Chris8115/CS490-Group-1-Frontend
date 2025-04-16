import { React, useState, useEffect } from 'react';
import '../../css/forums.css';
import BetterUNavbar from '../../components/BetterUNavbar';
import { Divider } from '@mui/material';
import Footer from '../../components/Footer';
import ForumPosts from './Forums/ForumPosts.js';

function Forums() {
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