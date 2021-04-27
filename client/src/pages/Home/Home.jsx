import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../helpers/userContext';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.css';
import axios from 'axios';

const Home = () => {
    const [riskFactor, setRiskFactor] = useState('');
    const [loading, setIsLoading] = useState(false);

    const user = useContext(UserContext);
    console.log(user);

    const history = useHistory();

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }
    
    const calculateAge = (dob) => {
        console.log(new Date(Date.now()).getFullYear() - dob.split('/').reverse()[0]);
        return (new Date(Date.now()).getFullYear() - dob.split('/').reverse()[0]);
    }

    useEffect(() => {
        if(!user.user.eftsCodes.length) {
            setRiskFactor('No efts code');
            return;
        }

        setIsLoading(true);
        axios.get('http://localhost:5000/calculate', {
            params: {
                id: user.user.id
            }
        }).then( ( {data}) => {
            if(!data.isPositive)
                setRiskFactor(data.riskFactor);
            else
                setRiskFactor('100%, recently tested positive');
            setIsLoading(false);
        }).catch( (e) => {
            if(e?.response?.data?.msg)
                setRiskFactor(e.response.data.msg);
            else
                setRiskFactor('Cannot calculate at the moment');
            setIsLoading(false);
        });
    }, [user.user.eftsCodes, user.user.id])

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
                    <p>
                        <span>Risk factor: </span>
                        {loading && <span>Loading..</span>}
                        {!loading && (isNaN(riskFactor) ? <span>{riskFactor}</span> : formattedRiskFactor(riskFactor))}
                    </p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

const formattedRiskFactor = (rf) => {
    return (Math.round(rf * 1000) / 10) + '%';
}
 
export default Home;