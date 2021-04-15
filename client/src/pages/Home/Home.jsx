import React, { useContext } from 'react';
import { UserContext } from '../../helpers/userContext';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    const user = useContext(UserContext);
    console.log(user);

    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }

    const calculateAge = (dob) => {
        let age = Math.floor((new Date(Date.now()).getFullYear() - new Date(dob).getFullYear()));
        return age;
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Your Account</h1>
            </div>
            <div className={styles.main}>
                <div className={styles.profile}>
                    <p><span>TC Kimlik no: </span> {user.user.id}</p>
                    <p><span>Name: </span> {user.user.fname}</p>
                    <p><span>Surname: </span> {user.user.sname}</p>
                    <p><span>Gender: </span> {user.user.gender === "M" ? "Male" : "Female"}</p>
                    <p><span>Date of birth: </span> {user.user.dob}</p>
                    <p><span>Age: </span> {calculateAge(user.user.dob)}</p>
                    <p><span>Risk status: </span> Riskless</p>
                    <p><span>Risk factor: </span> 15%</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}
 
export default Home;