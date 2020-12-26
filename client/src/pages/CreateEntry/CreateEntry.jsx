import React, { useState } from 'react';
import styles from './CreateEntry.module.css';
import axios from 'axios';

const CreateEntry = () => {

    const [codes, setCodes] = useState(["EFTS-"]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e, idx) => {

        const lastChar = e.target.value.charCodeAt(e.target.value.length - 1);
        if (codes[idx].length < e.target.value.length &&
            !(lastChar > 47 && lastChar < 58) && // numeric (0-9)
            !(lastChar > 64 && lastChar < 71) && // upper alpha (A-F)
            !(lastChar > 96 && lastChar < 103)) { // lower alpha (a-f)
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
                from: "EFTS-AAAA-AAAA-AAAA",
                to: filteredCodes
            }).then((res) => {
                console.log(res.data);
            }).catch((err) => {
                console.log(err.response.data.msg);
            }).then(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>

                <h1>Have a meeting?</h1>
            </div>
            <div className={styles.main}>
                <h2>Enter EFTS codes of the participants</h2>
                <div className={styles.addCodesDiv}>
                    <div className={styles.addCodesForm}>
                        {codes.map((code, idx) => {
                            return (
                                <input key={idx} placeholder="EFTS-XXXX-XXXX-XXXX" value={code} onChange={e => handleChange(e, idx)} />
                            )
                        })}
                        <button className={styles.addMoreBtn} onClick={handleAdd}>+ Add More</button>
                    </div>
                    
                </div>
                <button onClick={handleSubmit} disable={isLoading.toString()}>SUBMIT</button>
                {isLoading ? <p>Loading...</p> : null}
            </div>
        </div>
    );
}

export default CreateEntry;