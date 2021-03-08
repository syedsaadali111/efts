import React from 'react';
import {Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
        <h1>Home page</h1>
        <Link to="/rule">Create Rule</Link>
        </>
    );
}
 
export default Home;