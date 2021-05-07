import React, { useContext } from 'react';
import {useHistory} from 'react-router-dom';
import { UserContext } from '../../helpers/userContext';
import styles from './Home.module.css';

const Home = () => {

    const history = useHistory();

    const {user} = useContext(UserContext);
    //console.log(user);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Account Details</h1>
            </div>
            <div className={styles.main}>
                <div className={styles.profile}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Admin Username:</td>
                                <td>{user.username}</td>
                            </tr>
                            <tr>
                                <td>Admin type:</td>
                                <td>{user.type}</td>
                            </tr>                                    
                        </tbody>
                    </table>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}
 
export default Home;