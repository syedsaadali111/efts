import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { UserContext } from '../../helpers/userContext';
import * as RiIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';
import styles from './Navbar.module.css';

function Navbar() {

    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }

    const {user} = useContext(UserContext);

    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);

    const hideSidebar = () => setSidebar(false);

    return (
        <header className={styles.navbar}>
            <div className={styles.navbarLogo}>
                <h2>
                    <span className={styles.sidebarToggle}>{sidebar ? <RiIcons.RiMenuFoldLine onClick={showSidebar} /> : <RiIcons.RiMenuUnfoldLine onClick={showSidebar} />}</span>
                    EFTS
                </h2>
            </div>
            <nav className={styles.navMenu}>
                <ul>
                    <li><NavLink activeClassName={styles.active} to='/requests'>Institute Requests</NavLink></li>
                    <li><NavLink activeClassName={styles.active} to='/users'>Create Admin</NavLink></li>
                    <li><NavLink activeClassName={styles.active} to='/parameters'>Risk Factor Parameters</NavLink></li>
                    <li><NavLink activeClassName={styles.active} to='/report'>Contact History</NavLink></li>
                </ul>
            </nav>
            <nav className={sidebar ? `${styles.sidebar} ${styles.active}` : styles.sidebar}>
                <ul onClick={showSidebar}>
                    <li><NavLink activeClassName={styles.active} to='/requests'>Institute Requests</NavLink></li>
                    <li><NavLink activeClassName={styles.active} to='/users'>Create Admin</NavLink></li>
                    <li><NavLink activeClassName={styles.active} to='/parameters'>Risk Factor Parameters</NavLink></li>
                    <li><NavLink activeClassName={styles.active} to='/report'>Contact History</NavLink></li>
                </ul>
                <button onClick={handleLogout}>Logout</button>
            </nav>
            <div className={styles.navbarUser}>
                <p onClick={hideSidebar}>
                    <NavLink activeClassName={styles.active} exact to='/'>
                        <FaIcons.FaUser className={styles.icon}/>
                        {user.username} 
                    </NavLink>
                </p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );

}

export default Navbar;