import React, { useState } from 'react';
import styles from './Verify.module.css';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import QrReader from 'react-qr-reader';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';

const Verify = () => {

    const [efts, setEfts] = useState('EFTS-');
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [result, setResult] = useState({
        riskFactor: null,
        details: null,
        isPositive: null
    });
    const [showScanner, setShowScanner] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMsg('');
        setResult({
            riskFactor: null,
            details: null,
            isPositive: null
        });

        axios.get('http://localhost:5000/calculate', {
            params: {
                code: efts
            }
        }).then( ( {data}) => {
            setResult(data);
            setIsLoading(false);
            setEfts('EFTS-');
        }).catch( (e) => {
            if(e?.response?.data?.msg)
                setMsg(e.response.data.msg);
            else
                setMsg('Unknowm error occured, try again in a while');
            setIsLoading(false);
        });

        
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

    const handleQrError = () => {
        console.log("Scanner Error");
    }

    const handleQrScan = (data) => {
        if(data){
            console.log(data);
            setEfts(data);
            setShowScanner(false);
            return;
        }
    }
    
    const toggleScanner = () => {
        setShowScanner(!showScanner);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Verify an EFTS code</h1>
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
                <h2>Enter a citizen's EFTS code to test</h2>

                <form onSubmit={ (e) => { handleSubmit(e) }}>
                    <div className={styles.inputContainer}>
                        <input type="text" name="efts" id="efts" placeholder="EFTS-XXXX-XXXX-XXXX" value={efts} onChange={(e) => handleChange(e)}/>
                        <button type="button" className={styles.addMoreBtn} onClick={toggleScanner}>{showScanner ? 'Cancel' : '+ Scan QR'}</button>
                    </div>
                    {msg && <p>{msg}</p>}
                    <button type="submit">Verify</button>
                </form>

                {
                    (isLoading || result.riskFactor) !== null ? (
                        <>
                        <div className={styles.resultContainer}>
                            <h3>Risk Factor for this citizen <span className={styles.tooltip} data-tip="This percentage represents 
                            the risk an individual holds of spreading the disease/virus to others">?</span></h3>
                            {console.log(result)}
                            {result.isPositive ? <h3>This person was recently tested positive for the virus/disease</h3> : null}
                            <div className={styles.circleContainer}>
                                <CircularProgressbar 
                                    value={getValueForCircle(result.riskFactor)}
                                    maxValue={1}
                                    text={getTextForCircle(result.riskFactor)}
                                    strokeWidth={5}
                                    styles={buildStyles({
                                        // Text size
                                        textSize: '16px',
                                    
                                        // Colors
                                        pathColor: '#ba1b08',
                                        textColor: '#ba1b08',
                                        trailColor: '#d6d6d6',
                                        backgroundColor: '#3e98c7',
                                    })}
                                />
                            </div>
                        </div>
                        <ReactTooltip />
                        </>
                    ) : null
                }
            </div>
        </div>
    );
}

const formattedRiskFactor = (rf) => {
    return (Math.round(rf * 1000) / 10) + '%';
}

const getTextForCircle = (riskFactor) => {
    if(riskFactor === null) {
        return 'Loading...';
    }

    if(isNaN(riskFactor))
        return '100%';
    return formattedRiskFactor(riskFactor);
}

const getValueForCircle = (riskFactor) => {
    if(riskFactor === null)
        return 0;
    if(isNaN(riskFactor))
        return 1;
    return (riskFactor.toFixed(3));
}
 
export default Verify;