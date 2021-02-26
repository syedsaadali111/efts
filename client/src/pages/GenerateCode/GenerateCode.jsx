import React, { useContext, useState } from 'react';
import styles from './GenerateCode.module.css'
import axios from 'axios';
import { UserContext } from '../../helpers/userContext';

const GenerateCode = () => {

    const user = useContext(UserContext);

    const [error, setError] = useState("");
    const [qr, setQr] = useState(user.QRCode);
    const [eftsCode, setEftsCode] = useState(user.EFTScode);
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setError('');
        setLoading(true);
        setQr(null);
        setEftsCode('');
        axios.post('http://localhost:5002/generate', {
            id: user.id,
            ttl: 1000 * 60 * 60
        }).then((res) => {
            setQr(res.data.qrcode);
            setEftsCode(res.data.efts);
            setLoading(false);
        }).catch((e) => {
            setError("There was an error saving code to database. Try again.");
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Generate your EFTS code</h1>
            </div>
            <div className={styles.main}>
                <h2>{user.fname} {user.sname}</h2>
                <h2>{user.id}</h2>
                {!eftsCode && !loading && (
                    <p>You do not have an existing EFTS code, click the button below to generate one.</p>
                )}
                <button onClick={handleClick} disabled={loading}>GENERATE CODE</button>
                {error !== "" ? (<p>{error}</p>) : ''}
                {loading ? <p>Loading...</p> : null}
                {eftsCode !== '' ? <h2>{eftsCode}</h2> : null}
                {qr ? (<img style={{ "width": "200px", "height": "200px", "margin": "auto" }} alt="QR Code" src={qr} />) : null}
            </div>
        </div>
    );
}

export default GenerateCode;