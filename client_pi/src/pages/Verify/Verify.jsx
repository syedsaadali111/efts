import React, { useState } from 'react';
import styles from './Verify.module.css';
import axios from 'axios';

const Verify = () => {

    const [efts, setEfts] = useState('EFTS-');
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [citizen, setCitizen] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMsg('');
        setCitizen(null);

        axios.post('http://localhost:5006/verify', { efts: efts}).then( ( {data}) => {
            setCitizen(data);
            setIsLoading(false);
            setEfts('EFTS-');
        }).catch( (e) => {
            if(e.response.status === 404)
                setMsg("EFTS code is invalid");
            else
                setMsg("An error occured, try again later");
            setIsLoading(false);
        })

        
    }

    const handleChange = (e) => {
        const lastChar = e.target.value.charCodeAt(e.target.value.length - 1);
        if (efts.length < e.target.value.length &&
            !(lastChar > 47 && lastChar < 58) && // numeric (0-9)
            !(lastChar > 64 && lastChar < 91) && // upper alpha (A-Z)
            !(lastChar > 96 && lastChar < 123)) { // lower alpha (a-z)
            return;
        }

        if (e.target.value.length > 19) {
            return;
        }

        const rawChars = e.target.value.replace(/-/g, '');
        const len = rawChars.length;
        let formattedValue = e.target.value;
        if (len !== 0 && len % 4 === 0 && len < 16 && efts.length < e.target.value.length) {
            formattedValue += '-';
        }
        if (efts.length > e.target.value.length && efts.charAt(efts.length - 1) === '-') {
            formattedValue = formattedValue.slice(0, -1);
        }

        setEfts(formattedValue);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Verify an EFTS code</h1>
            </div>
            <div className={styles.main}>
                <h2>Enter a citizen's EFTS code to test</h2>
                <form onSubmit={ (e) => { handleSubmit(e) }}>
                    <label>Enter EFTS Code</label>
                    <input type="text" name="efts" id="efts" placeholder="EFTS-XXXX-XXXX-XXXX" value={efts} onChange={(e) => handleChange(e)}/>
                    {msg && <p>{msg}</p>}
                    {isLoading && <p>Loading...</p>}
                    <button type="submit">Verify</button>
                </form>

                {
                    citizen !== null ? (
                        <div className={styles.resultContainer}>
                            <h3>{secureName(citizen.Name)}</h3>
                            <h3>This citizen is</h3>
                            {citizen.status ? (<h1>RISKY</h1>) : (<h1>RISKLESS</h1>)}
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}

const secureName = (name) =>{
    const nameArr = name.split(' ');
    const newName = nameArr[0].charAt(0) + nameArr[0].charAt(1) + '**** ' + 
                    nameArr[1].charAt(0) + nameArr[1].charAt(1) + '****';
    
    return newName;
}
 
export default Verify;