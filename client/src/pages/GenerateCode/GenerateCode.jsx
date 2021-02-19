import React, { useContext, useState } from 'react';
import styles from './GenerateCode.module.css'
import axios from 'axios';
import { UserContext } from '../../helpers/userContext';

const GenerateCode = () => {

    const user = useContext(UserContext);

    const [state, setState] = useState({
        "TC": '',
        "FName": '',
        "SName": '',
        "DOB": ''
    });
    const [error, setError] = useState("");
    const [qr, setQr] = useState(null);
    const [eftsCode, setEftsCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        let value = e.target.value;

        setState((prevState) => {
            return {
                ...prevState,
                [e.target.name]: value
            }
        });
    }

    const submitData = () => {
        setError('');
        setLoading(true);
        setQr(null);
        setEftsCode('');
        const formData = {...state};
        formData.TC = parseInt(state.TC);
        formData.DOB = state.DOB.split('-').reverse().join('/');
        axios.post('http://localhost:5001/verify', formData).then((res) => {
            const id = res.data.TC;
            axios.post('http://localhost:5002/generate', {
                id: id,
                ttl: 1000 * 60
            }).then((res) => {
                setQr(res.data.qrcode);
                setEftsCode(res.data.efts);
                setLoading(false);
                setState({
                    "TC": '',
                    "FName": '',
                    "SName": '',
                    "DOB": ''
                });
            }).catch((e) => {
                setError("There was an error saving code to database. Try again.");
            });

        }).catch((e) => {
            setError("No user found!");
            setLoading(false);
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Generate your EFTS code</h1>
                <h1>{user.name}</h1>
            </div>
            <div className={styles.main}>
                <h2>Enter your credentials</h2>
                <label onChange={e => handleChange(e)} htmlFor="TC">TC Kimlik Number</label>
                <input value={state.TC} type="number" onChange={e => handleChange(e)} id="TC" name="TC" placeholder="Your national ID" />
                <label onChange={e => handleChange(e)} htmlFor="FName">First Name</label>
                <input value={state.FName} onChange={e => handleChange(e)} id="FName" name="FName" placeholder="First Name" />
                <label onChange={e => handleChange(e)} htmlFor="SName">Last Name</label>
                <input value={state.SName} onChange={e => handleChange(e)} id="SName" name="SName" placeholder="Last Name" />
                <label onChange={e => handleChange(e)} htmlFor="DOB">Date of birth</label>
                <input value={state.DOB} type="date" onChange={e => handleChange(e)} id="DOB" name="DOB" placeholder="Date of birth" />
                <button onClick={submitData} disabled={loading}>GENERATE CODE</button>
                {error !== "" ? (<p>{error}</p>) : ''}
                {loading ? <p>Loading...</p> : null}
                {eftsCode !== '' ? <h2>{eftsCode}</h2> : null}
                {qr ? (<img style={{ "width": "200px", "height": "200px", "margin": "auto" }} alt="QR Code" src={qr} />) : null}
            </div>
        </div>
    );
}

export default GenerateCode;