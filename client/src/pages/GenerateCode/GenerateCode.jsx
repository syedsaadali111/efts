import React, { useContext, useState } from 'react';
import styles from './GenerateCode.module.css'
import axios from 'axios';
import { UserContext } from '../../helpers/userContext';

const GenerateCode = () => {

    const {user, setUser} = useContext(UserContext);

    const [ttl, setTtl] = useState(60);
    const [error, setError] = useState("");
    const [eftsCode, setEftsCode] = useState(user.eftsCodes);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        const value = e.target.value;
        setTtl(value);
    }

    const handleClick = () => {
        setError('');
        setLoading(true);

        if (ttl === '' || isNaN(parseInt(ttl)) || parseInt(ttl) < 1) {
            setLoading(false);
            setError('The entered value is not allowed');
            return;
        }

        axios.post('http://localhost:5002/generate', {
            id: user.id,
            ttl: ttl
        }).then((res) => {
            setEftsCode([...eftsCode, res.data.newCode]);
            setUser({
                ...user,
                eftsCodes: [...user.eftsCodes, res.data.newCode]
            });
            setLoading(false);
            setError('Code generated successfully');
        })
        .catch((e) => {
            setError("There was an error saving code to database. Try again.");
            setLoading(false);
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Generate your EFTS code</h1>
            </div>
            <div className={styles.main}>
                <h2>{user.fname} {user.sname}<br/><br/>{user.id}</h2>
                { eftsCode.length === 0 && !loading && (
                    <p className={styles.alignCenter}>You do not have an existing EFTS code, click the button below to generate one.</p>
                )}
                <div className={styles.ttlContainer}>
                    <label htmlFor="ttl">Enter the number of days before code becomes invalid</label>
                    <input type='number' min="0" name="ttl" id="ttl" value={ttl} onChange={(e) => handleChange(e)}></input>
                </div>
                <button onClick={handleClick} disabled={loading}>GENERATE CODE</button>
                {error !== "" ? (<p className={styles.alignCenter}>{error}</p>) : ''}
                {loading ? <p className={styles.alignCenter}>Loading...</p> : null}
                {eftsCode.length !== 0 ? (
                    <div className={styles.codesTable}>
                        {eftsCode.map((code, idx) => {
                            return (
                                <div className={styles.codesRow} key={code.EFTScode}>
                                    <div>
                                        <h2>{code.EFTScode} <span className={styles.copy} onClick={() => {navigator.clipboard.writeText(code)}}>Copy</span></h2>
                                        <p>Expires at: {formatDate(code.expirationDate)}</p>
                                    </div>
                                    <img style={{ "width": "150px", "height": "150px" }} alt="QR Code" src={code.qrcode_image} />
                                </div>
                            )
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

const formatDate = (date) => {
    const dateTimeArr = date.split('T');
    const dateStr = dateTimeArr[0].split('-').reverse().join('/');
    const timeArr = dateTimeArr[1].split(':');
    return dateStr + " " + timeArr[0] + ":" + timeArr[1];
}

export default GenerateCode;