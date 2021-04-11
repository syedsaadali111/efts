import { useEffect, useState } from 'react';
import { getJWT } from '../../helpers/jwt';
import styles from './Requests.module.css';
import axios from 'axios';

const Requests = () => {

    const [institutes, setInstitutes] = useState([]);

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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Public Institute Requests</h1>
            </div>
            <div className={styles.main}>
                <h2>Approve or Reject these public institutes</h2>
                {institutes.map((i) => {
                    return (
                        <div>
                            <p>{i.name}</p>
                            <p>{i.description}</p>
                            <p>{i.context}</p>
                            <p>{i.email}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Requests;