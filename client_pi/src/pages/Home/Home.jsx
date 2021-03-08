import React from 'react';
import {Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    return (
        <>
            <h1>Home page</h1>
            <div className={styles.main}>
                <Link to="/rule"><button>Create Rule</button></Link>
                <Link to="/verify"><button>EFTS Code Verification</button></Link>
            </div>
        </>
    );
}
 
export default Home;