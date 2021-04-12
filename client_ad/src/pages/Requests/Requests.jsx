import { useEffect, useState } from 'react';
import { getJWT } from '../../helpers/jwt';
import styles from './Requests.module.css';
import axios from 'axios';

const Requests = () => {

    const [institutes, setInstitutes] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect( () => {
        const jwt = getJWT();
        axios.get('http://localhost:5005/getallpending', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
        }).then( ({data}) => {
            console.log(data);
            setInstitutes(data);
        })
    }, []);

    const respond = (email, response) => {
        const jwt = getJWT();
        axios.post('http://localhost:5005/makedecision', {decision: response, email: email}, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).then(() => {
            setMsg('Response Successful');
        }).catch(() => {
            setMsg('An error occured, try again');
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Public Institute Requests</h1>
            </div>
            <div className={styles.main}>
                <h2>Approve or Reject these public institutes</h2>
                {institutes.map((i) => {
                    return (
                        <div key={i._id}>
                            <p>{i.name}</p>
                            <p>{i.description}</p>
                            <p>{i.context}</p>
                            <p>{i.email}</p>
                            <p>{i.rule_issuer.toString()}</p>
                            <p>{i.phone}</p>
                            <p>{i.address}</p>
                            <button onClick={() => respond(i.email, true)}>Accept</button>
                            <button onClick={() => respond(i.email, false)}>Reject</button>
                        </div>
                    )
                })}
                {msg && <p>{msg}</p>}
            </div>
        </div>
    );
}

export default Requests;