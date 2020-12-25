import React, { useState } from 'react';
import axios from 'axios';

const GenerateCode = () => {

    const [state, setState] = useState({
        "TC": 0,
        "FName": '',
        "SName": '',
        "DOB": ''
    });
    const [error, setError] = useState("");
    const [qr, setQr] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setError('');
        let value = e.target.value;

        if(e.target.name === "TC"){
            value = parseInt(e.target.value);
            console.log(e.target.value);
        }

        if(e.target.name === "DOB") {
            value = value.split('-').reverse().join('/');
        }

        setState( (prevState) => {
            return {
                ...prevState,
                [e.target.name]: value
            }
        }); 
    }

    const submitData = () => {
        setLoading(true);
        axios.post('http://localhost:5001/verify', state).then( (res) => {
            const id = res.data.TC;
            console.log(id);
            axios.post('http://localhost:5002/generate', {
                id: id,
                ttl: 1000 * 60
            }).then( (res) => {
                console.log(res.data);
                setQr(res.data.qrcode);
                setLoading(false);
            }).catch( (e) => {
                setError("There was an error saving code to database. Try again.");
            });

        }).catch( (e) => {
            setError("No user found!");
            setLoading(false);
        })
    }

    return(
        <div style={{"display": "flex", "flexDirection": "column", "width": "50%", "margin": "auto"}}>
            <label onChange={e => handleChange(e)} htmlFor="TC">TC Kimlik Number</label>
            <input type="number" onChange={e => handleChange(e)} id="TC" name="TC" placeholder="Your national ID"/>
            <label onChange={e => handleChange(e)} htmlFor="FName">First Name</label>
            <input onChange={e => handleChange(e)} id="FName" name="FName" placeholder="First Name"/>
            <label onChange={e => handleChange(e)} htmlFor="SName">Last Name</label>
            <input onChange={e => handleChange(e)} id="SName" name="SName" placeholder="Last Name"/>
            <label onChange={e => handleChange(e)} htmlFor="DOB">Date of birth</label>
            <input type="date" onChange={e => handleChange(e)} id="DOB" name="DOB" placeholder="Date of birth"/>
            <button onClick={submitData} disabled={loading}>Generate Code</button>
            {error !== "" ? (<p>{error}</p>) : ''}
            {qr ? (<img style={{"width": "200px", "height": "200px"}} alt="QR Code" src={qr}/>) : null}
        </div>
    );
}
 
export default GenerateCode;