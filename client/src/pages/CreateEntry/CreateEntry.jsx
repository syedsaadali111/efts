import React, { useState, useContext } from 'react';
import styles from './CreateEntry.module.css';
import axios from 'axios';
import { UserContext } from '../../helpers/userContext';

const CreateEntry = () => {

    const user = useContext(UserContext);

    const [codes, setCodes] = useState(["EFTS-"]);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleChange = (e, idx) => {

        const lastChar = e.target.value.charCodeAt(e.target.value.length - 1);
        if (codes[idx].length < e.target.value.length &&
            !(lastChar > 47 && lastChar < 58) && // numeric (0-9)
            !(lastChar > 64 && lastChar < 91) && // upper alpha (A-Z)
            !(lastChar > 96 && lastChar < 123)) { // lower alpha (a-z)
            return;
        }

        if (e.target.value.length > 19) {
            return;
        }

        const newCodes = [...codes];
        const rawChars = e.target.value.replace(/-/g, '');
        const len = rawChars.length;
        let formattedValue = e.target.value;
        if (len !== 0 && len % 4 === 0 && len < 16 && codes[idx].length < e.target.value.length) {
            formattedValue += '-';
        }
        if (codes[idx].length > e.target.value.length && codes[idx].charAt(codes[idx].length - 1) === '-') {
            formattedValue = formattedValue.slice(0, -1);
        }
        // newCodes[idx] = e.target.value;
        newCodes[idx] = formattedValue;
        setCodes(newCodes);
    }

    const handleAdd = () => {
        setCodes([...codes, "EFTS-"]);
    }

    const handleSubmit = () => {

        setIsLoading(true);
        const filteredCodes = codes.filter((c) => c !== "");

        if (filteredCodes.length !== 0) {
            axios.post('http://localhost:5000/filiation', {
                from: user.EFTScode,
                to: filteredCodes
            }).then((res) => {
                setMsg('Participants added successfully');
            }).catch((err) => {
                if(err.response) {
                    setMsg(err.response.data.msg);
                } else {
                    setMsg('Unknown error occured. Check your internet connection');
                }
            }).then(() => {
                setIsLoading(false);
                setCodes(["EFTS-"]);
            });
        } else {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Meeting Someone?</h1>
            </div>
            <div className={styles.main}>
                <div className={styles.addCodesDiv}>
                    <div className={styles.addCodesForm}>
                        <h2>Enter EFTS codes of other participants</h2>
                        {codes.map((code, idx) => {
                            return (
                                <input key={idx} placeholder="EFTS-XXXX-XXXX-XXXX" value={code} onChange={e => handleChange(e, idx)} />
                            )
                        })}
                        <button className={styles.addMoreBtn} onClick={handleAdd}>+ Add More</button>
                    </div>
                </div>
                <button onClick={handleSubmit} disable={isLoading.toString()}>SUBMIT</button>
                {isLoading ? <p className={styles.msg}>Loading...</p> : null}
                {msg !== '' ? <p className={styles.msg}>{msg}</p> : null}
            </div>
        </div>
    );
}

export default CreateEntry;