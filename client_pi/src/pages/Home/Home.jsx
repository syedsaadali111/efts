import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.css';
import { UserContext } from '../../helpers/userContext';


const Home = () => {

    const user = useContext(UserContext);
    console.log(user);

    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }

    /*
        address: "Somewhere, some city, 06800, Turkey"
        context: "travel"
        description: "This institute will be responsible for applying rules that restrict inter province travels"
        email: "saadiali111@hotmail.com"
        name: "Tourism Ministry"
        phone: 5076752437
        rule_issuer: true
    */

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Your Account</h1>
            </div>
            <div className={styles.main}>
                <div className={styles.profile}>
                    <table>
                        <tr>
                            <td>Name:</td>
                            <td>{user.name}</td>
                        </tr>
                        <tr>
                            <td>Address:</td>
                            <td>{user.address}</td>
                        </tr>   
                        <tr>
                            <td>Type of institute:</td>
                            <td>{user.context.charAt(0).toUpperCase() + user.context.slice(1)}</td>
                        </tr>                     
                        <tr>
                            <td>Description:</td>
                            <td>{user.description}</td>
                        </tr>
                        <tr>
                            <td>Email:</td>
                            <td>{user.email}</td>
                        </tr>
                        <tr>
                            <td>Phone no:</td>
                            <td>{user.phone}</td>
                        </tr>
                        <tr>
                            <td colSpan='2'>
                                {user.rule_issuer ? "Allowed to issue rules" : "Not allowed to issue rules" }
                            </td>
                        </tr>
                    </table>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Home;