import React, {useState} from 'react';
import styles from './SignUp.module.css';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const SignUp = () => {

    const [formState, setFormState] = useState(
        {
            TC: "",
            fname: "",
            sname: "",
            dob: "",
            gender: "",
            email: "",
            occupation: "",
            phone: "",
            password: "",
            password2: ""
        }
    );
    const [msg,setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const handleChange = (e) => {
        setFormState( {
            ...formState,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        console.log("submit");
        if (
            formState.TC &&
            formState.fname &&
            formState.sname &&
            formState.dob &&
            formState.gender &&
            formState.email &&
            formState.occupation &&
            formState.phone &&
            formState.password &&
            formState.password2
        ) {
            if (!isDateValid(formState.dob)){
                setMsg('Date value is invalid!');
                setLoading(false);
                return;
            }

            if (formState.password === formState.password2) {

                const userData = {...formState};
                userData.dob = formState.dob.split('-').reverse().join('/'); //format date according to db
                axios.post('http://localhost:5003/signup', userData).then( (res) => {
                    setMsg('User Created Successfully.');
                    setFormState(
                        {
                            TC: "",
                            fname: "",
                            sname: "",
                            dob: "",
                            gender: "",
                            email: "",
                            occupation: "",
                            phone: "",
                            password: "",
                            password2: ""
                        }
                    );
                    setLoading(false);
                    history.push("/login");
                }).catch( () => {
                    setMsg('A server error occured, try again in a while.');
                    setLoading(false);
                })
            } else {
                setMsg("Passwords do not match");
                setLoading(false);
            }
        } else {
            setMsg("All fields are required");
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Register</h1>
            </div>
            <div className={styles.main}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="TC">TC Kimlik Number</label>
                    <input value={formState.TC} type="number" onChange={e => handleChange(e)} id="TC" name="TC" placeholder="Your national ID" />
                    <label htmlFor="fname">First Name</label>
                    <input value={formState.fname} onChange={e => handleChange(e)} id="fname" name="fname" placeholder="First Name" />
                    <label htmlFor="sname">Last Name</label>
                    <input value={formState.sname} onChange={e => handleChange(e)} id="sname" name="sname" placeholder="Last Name" />
                    <label htmlFor="DOB">Date of birth</label>
                    <input value={formState.dob} type="date" onChange={e => handleChange(e)} id="dob" name="dob" placeholder="Date of birth" />
                    <label>Gender</label>
                    <div className={styles.radioGroup}>
                        <input checked={formState.gender === "M"} type="radio" onChange={e => handleChange(e)} id="male" name="gender" value="M"/>
                        <label htmlFor="male">Male</label>
                        <input checked={formState.gender === "F"} type="radio" onChange={e => handleChange(e)} id="female" name="gender" value="F"/>
                        <label htmlFor="female">Female</label>
                    </div>
                    <label htmlFor="email">Email Address</label>
                    <input value={formState.email} onChange={e => handleChange(e)} id="email" name="email" placeholder="someone@example.com" />
                    <label htmlFor="occupation">Occupation</label>
                    <select value={formState.occupation} onChange={e => handleChange(e)} id="occupation" name="occupation">
                        <option value="">&lt;choose&gt;</option>
                        <option value="Front Line Hospital Employee">Front Line Hospital Employee</option>
                        <option value="Police">Police</option>
                        <option value="Military">Military</option>
                        <option value="Paramilitary personnel">Paramilitary personnel</option>
                        <option value="Civic worker">Civic worker</option>
                        <option value="Emergency response workers">Emergency response workers</option>
                    </select>
                    <label htmlFor="phone">Phone Number</label>
                    <div className={styles.phone}>
                        <label htmlFor="phone">+90</label>
                        <input value={formState.phone} type="number" onChange={e => handleChange(e)} id="phone" name="phone"/>
                    </div>
                    <label htmlFor="password">Password</label>
                    <input value={formState.password} onChange={e => handleChange(e)} type="password" id="password" name="password"/>
                    <label htmlFor="password2">Confirm Password</label>
                    <input value={formState.password2} onChange={e => handleChange(e)} type="password" id="password2" name="password2"/>
                    {msg && <p>{msg}</p>}
                    <button disabled={loading} type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

const isDateValid = (dateString) => {
    const dateArr = dateString.split('-');
    const dob = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    const currDate = new Date();
    dob.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);
    return dob <= currDate;
}
 
export default SignUp;