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

    const user = useContext(UserContext);
    
    return (
        <div className={styles.main}>
            <h1>{user.user.fname} {user.user.sname}</h1>
            <Link to='/filiation'>Contact Tracing</Link>
            <Link to='/generate'>Your EFTS codes</Link>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
 
export default Home;