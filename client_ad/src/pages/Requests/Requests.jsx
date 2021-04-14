import { useEffect, useState } from 'react';
import { getJWT } from '../../helpers/jwt';
import styles from './Requests.module.css';
import axios from 'axios';

const Requests = () => {

    const [institutes, setInstitutes] = useState([]);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect( () => {
        setLoading(true);
        const jwt = getJWT();
        axios.get('http://localhost:5005/getallpending', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
        }).then( ({data}) => {
            setInstitutes(data);
            setLoading(false);
        });
    }, []);

    const respond = (email, response) => {
        const jwt = getJWT();
        setLoading(true);
        axios.post('http://localhost:5005/makedecision', {decision: response, email: email}, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).then(() => {
            flashMessage('Response Successful');
            const newArr = institutes.filter(i => i.email !== email);
            setInstitutes(newArr);
            setLoading(false);
        }).catch(() => {
            setMsg('An error occured, try again');
            setLoading(false);
        })
    }

    const flashMessage = (text) => {
        setMsg(text);
        setTimeout( () => {
            setMsg('');
        }, 3500);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Public Institute Requests</h1>
            </div>
            <div className={styles.main}>
                {!!institutes.length ?
                    <h2>Approve or Reject these public institutes</h2>
                :
                    <h2>No pending requests at the moment</h2>
                }
                {loading && <h3>Loading...</h3>}
                {msg && <p>{msg}</p>}
                {institutes.map((i) => {
                    return (
                        <div className={styles.row} key={i._id}>
                            <div className={styles.content}>
                                <div className={styles.left}>
                                    <div className={styles.flex}>
                                        <p className={styles.label}>Institute Title: </p>
                                        <p>{i.name}</p>
                                    </div>
                                    <div>
                                        <p className={styles.label}>Description: </p>
                                        <p>{i.description}</p>
                                    </div>
                                    <div className={styles.flex}>
                                        <p className={styles.label}>Context: </p>
                                        <p>{toTitleCase(i.context)}</p>
                                    </div>
                                    <div className={styles.flex}>
                                        <p className={styles.label}>Permission to issue rules: </p>
                                        <p>{i.rule_issuer ? 'Requested' : 'Not Requested'}</p>
                                    </div>
                                </div>
                                <div className={styles.right}>
                                    <div className={styles.flex}>
                                        <p className={styles.label}>Contact Email: </p>
                                        <p>{i.email}</p>
                                    </div>
                                    <div className={styles.flex}>
                                        <p className={styles.label}>Contact Number: </p>
                                        <p>{i.phone}</p>
                                    </div>
                                    <div>
                                        <p className={styles.label}>Address: </p>
                                        <p>{i.address}</p>
                                    </div>
                                </div>
                            </div><div className={styles.bottom}>
                                <button onClick={() => respond(i.email, true)}>Accept</button>
                                <button onClick={() => respond(i.email, false)}>Reject</button>
                            </div>
                        </div>
                    )
                })}
                {loading && <h3>Loading...</h3>}
                {msg && <p>{msg}</p>}
            </div>
        </div>
    );
}

const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export default Requests;