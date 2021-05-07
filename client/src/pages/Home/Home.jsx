import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../helpers/userContext';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.css';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactTooltip from 'react-tooltip';

const Home = () => {
    const [riskFactor, setRiskFactor] = useState(null);
    const [loading, setIsLoading] = useState(false);

    const user = useContext(UserContext);
    //console.log(user);

    const history = useHistory();
    
    const calculateAge = (dob) => {
        console.log(new Date(Date.now()).getFullYear() - dob.split('/').reverse()[0]);
        return (new Date(Date.now()).getFullYear() - dob.split('/').reverse()[0]);
    }

    useEffect(() => {
        if (!user.user.eftsCodes.length) {
            setRiskFactor('No EFTS Code');
            return;
        }

        setIsLoading(true);
        axios.get('http://localhost:5000/calculate', {
            params: {
                id: user.user.id
            }
        }).then(({ data }) => {
            if (!data.isPositive)
                setRiskFactor(data.riskFactor);
            else
                setRiskFactor('100%, recently tested positive');
            setIsLoading(false);
        }).catch((e) => {
            if (e?.response?.data?.msg)
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
                    <table>
                        <tbody>
                            <tr>
                                <td>Citizen ID:</td>
                                <td>{user.user.id}</td>
                            </tr>
                            <tr>
                                <td>Name:</td>
                                <td>{user.user.fname}</td>
                            </tr>
                            <tr>
                                <td>Surname:</td>
                                <td>{user.user.sname}</td>
                            </tr>
                            <tr>
                                <td>Gender:</td>
                                <td>{user.user.gender === "M" ? "Male" : "Female"}</td>
                            </tr>
                            <tr>
                                <td>Date of Birth:</td>
                                <td>{user.user.dob}</td>
                            </tr>
                            <tr>
                                <td>Age:</td>
                                <td>{calculateAge(user.user.dob)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style={{ marginRight: "5px" }}>Risk Factor
                        <span className={styles.tooltip}
                            data-tip="This percentage represents 
                            the risk an individual holds of
                            spreading the disease/virus to others">?
                        </span>
                    </p>
                    {isNaN(riskFactor) ? <p>Recently tested positive!</p> : null}
                    <ReactTooltip />
                    <div className={styles.circleContainer}>
                        <CircularProgressbar
                            value={getValueForCircle(riskFactor)}
                            maxValue={1}
                            text={getTextForCircle(riskFactor)}
                            strokeWidth={5}
                            styles={buildStyles({
                                // Text size
                                textSize: '16px',

                                // Colors
                                pathColor: '#ba1b08',
                                textColor: '#ba1b08',
                                trailColor: '#d6d6d6',
                                backgroundColor: '#3e98c7',
                            })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const getTextForCircle = (riskFactor) => {
    if (riskFactor === null) {
        return 'Loading...';
    }

    if (isNaN(riskFactor))
        return '100%';
    return formattedRiskFactor(riskFactor);
}

const getValueForCircle = (riskFactor) => {
    if (riskFactor === null)
        return 0;
    if (isNaN(riskFactor))
        return 1;
    return (riskFactor.toFixed(3));
}

const formattedRiskFactor = (rf) => {
    return (Math.round(rf * 1000) / 10) + '%';
}

export default Home;