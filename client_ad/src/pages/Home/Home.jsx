import React, { useContext } from 'react';
import {Link, useHistory} from 'react-router-dom';
import { UserContext } from '../../helpers/userContext';
import styles from './Home.module.css';

const Home = () => {

    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }

    const {user} = useContext(UserContext);

    return (
        <div className={styles.main}>
            <Link to='/requests'>Institute Requests</Link>
            <Link to='/users'>Adminsitrators</Link>
            <Link to='/'>Risk Factor Calculations</Link>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
 
export default Home;