import React, { useContext, useState } from 'react';
import styles from './GenerateCode.module.css'
import axios from 'axios';
import { UserContext } from '../../helpers/userContext';

const GenerateCode = () => {

    const {user, setUser} = useContext(UserContext);

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
            setQr([...qr, res.data.qrcode]);
            setEftsCode([...eftsCode, res.data.efts]);
            console.log("USER");
            console.log(user);
            setUser({
                ...user,
                EFTScode: [...user.EFTScode, res.data.efts],
                QRCode: [...user.QRCode, res.data.qrcode]
            });
            setLoading(false);
            setError('Code generated successfully');
        })
        .catch((e) => {
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
                { eftsCode.length === 0 && !loading && (
                    <p className={styles.alignCenter}>You do not have an existing EFTS code, click the button below to generate one.</p>
                )}
                <button onClick={handleClick} disabled={loading}>GENERATE CODE</button>
                {error !== "" ? (<p className={styles.alignCenter}>{error}</p>) : ''}
                {loading ? <p className={styles.alignCenter}>Loading...</p> : null}
                {eftsCode.length !== 0 ? (
                    <div className={styles.codesTable}>
                        {eftsCode.map((code, idx) => {
                            return (
                                <div className={styles.codesRow} key={code}>
                                    <h2>{code} <span className={styles.copy} onClick={() => {navigator.clipboard.writeText(code)}}>Copy</span></h2>
                                    <img style={{ "width": "150px", "height": "150px" }} alt="QR Code" src={qr[idx]} />
                                </div>
                            )
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default GenerateCode;