import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {

    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }

    return (
        <>
            <div className={styles.main}>
                <Link to="/rule">Create Rule</Link>
                <Link to="/verify">EFTS Code Verification</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </>
    );
}
 
export default Home;