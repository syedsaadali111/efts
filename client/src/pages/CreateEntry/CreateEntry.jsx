import React, { useState, useContext } from 'react';
import styles from './CreateEntry.module.css';
import axios from 'axios';
import { UserContext } from '../../helpers/userContext';
import QrReader from 'react-qr-reader';

const CreateEntry = () => {

    const {user} = useContext(UserContext);

    const [codes, setCodes] = useState(["EFTS-"]);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [outdoors, setOutdoors] = useState(false);
    const [duration, setDuration] = useState('');

    const handleCheckboxChange = (e) => {
        setOutdoors(e.target.checked);
    }

    const handleSelect = (e) => {
        setDuration(e.target.value);
    }

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
        setMsg('');

        if (duration === '') {
            setMsg('Please specify meeting duration');
            setIsLoading(false);
            return;
        }

        const filteredCodes = codes.filter((c) => c !== "");
        if (filteredCodes.length !== 0) {
            axios.post('http://localhost:5000/filiation', {
                from: user.id,
                to: filteredCodes,
                duration: duration,
                outdoors: outdoors
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

    const handleQrError = () => {
        console.log("Scanner Error");
    }

    const handleQrScan = (data) => {
        if(data){
            console.log(data);
            for(let i = 0; i < codes.length; i++) {
                if (codes[i] === 'EFTS-' || codes[i]==='') {
                    const newCodes = [...codes];
                    newCodes[i] = data;
                    setCodes(newCodes);
                    setShowScanner(false);
                    return;
                }
            }
            const newCodes = [...codes, data];
            setCodes(newCodes);
            setShowScanner(false);
        }
    }
    
    const toggleScanner = () => {
        setShowScanner(!showScanner);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Meeting Someone?</h1>
            </div>
            <div className={styles.main}>
                {
                    showScanner ? (
                        <div className={styles.qrContainer}>
                            <QrReader
                                delay={300}
                                onError={handleQrError}
                                onScan={(data) => handleQrScan(data)}
                            />
                        </div>
                    ) : null
                }
                <div className={styles.addCodesDiv}>
                    <h2>Enter or scan EFTS codes of other participants</h2>
                    <div className={styles.addCodesForm}>
                        {codes.map((code, idx) => {
                            return (
                                <input key={idx} placeholder="EFTS-XXXX-XXXX-XXXX" value={code} onChange={e => handleChange(e, idx)} />
                            )
                        })}
                        <div className={styles.buttonContainer}>
                            <button className={styles.addMoreBtn} onClick={handleAdd}>+ Add More</button>
                            <button className={styles.addMoreBtn} onClick={toggleScanner}>{showScanner ? 'Cancel' : '+ Scan QR'}</button>
                        </div>
                    </div>
                </div>
                <div className={styles.outdoors}>
                    <input id="outdoors" name="outdoors" type="checkbox" checked={outdoors} onChange={handleCheckboxChange}></input>
                    <label htmlFor="outdoors">This meeting took place outdoors</label>
                </div>
                <div className={styles.duration}>
                    <label htmlFor="duration">Meeting duration: </label>
                    <select name="duration" id="duration" onChange={handleSelect} value={duration}>
                        <option value="">&lt;select&gt;</option>
                        <option value="low"> Less than or equal to 5 minutes</option>
                        <option value="mid"> Less than or equal to 15 minutes</option>
                        <option value="high"> More than 15 minutes</option>
                    </select>
                </div>
                <button onClick={handleSubmit} disable={isLoading.toString()}>SUBMIT</button>
                {isLoading ? <p className={styles.msg}>Loading...</p> : null}
                {msg !== '' ? <p className={styles.msg}>{msg}</p> : null}
            </div>
        </div>
    );
}

export default CreateEntry;