import React, { Component, useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { UserContext } from '../../helpers/userContext';
import styles from './Navbar.module.css';

function Navbar () {

    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }

    const user = useContext(UserContext);

    return (
        <header className={styles.navbar}>
            <div className={styles.navbarLogo}>
                <NavLink to='/'><h2>EFTS</h2></NavLink>
            </div>            
            <div className={styles.navbarItems}>
                <ul>
                    <li><NavLink to='/filiation'>Contact Tracing</NavLink></li>
                    <li><NavLink to='/generate'>Your EFTS codes</NavLink></li>
                </ul>
            </div>
            <div className={styles.navbarUser}>
                <p>{user.user.fname} {user.user.sname}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
    
}

export default Navbar;