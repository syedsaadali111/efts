import React, {useState} from 'react';
import styles from './CreateUser.module.css';
import axios from 'axios';
import { getJWT } from '../../helpers/jwt';

const CreateUser = () => {

    const [formState, setFormState] = useState(
        {
            username: "",
            password: "",
            password2: "",
        }
    );
    const [msg,setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [tempUsername, setTempUsername] = useState('');

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
            formState.username &&
            formState.password &&
            formState.password2
        ) {
            if (formState.password === formState.password2) {

                const userData = {...formState};
                const jwt = getJWT();
                axios.post('http://localhost:5005/adduser', userData, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }).then( (res) => {
                    setMsg('User Created Successfully.');
                    setTempUsername(formState.username);
                    setFormState(
                        {
                            username: "",
                            password: "",
                            password2: ""
                        }
                    );
                    setLoading(false);
                    setSignUpSuccess(true);
                }).catch( (err) => {
                    if (err.response) {
                        console.log(err.response);
                        setMsg(err.response.data.msg);
                    } else {
                        setMsg('A server error occured, try again in a while.');
                    }
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
                <h1>Administrators</h1>
            </div>
            <div className={styles.main}>
                <h2>Create a new user with administrator privileges</h2>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="username">Username</label>
                    <input value={formState.username} onChange={e => handleChange(e)} id="username" name="username" />
                    <label htmlFor="password">Password</label>
                    <input value={formState.password} onChange={e => handleChange(e)} type="password" id="password" name="password"/>
                    <label htmlFor="password2">Confirm Password</label>
                    <input value={formState.password2} onChange={e => handleChange(e)} type="password" id="password2" name="password2"/>
                    {msg && <p>{msg}</p>}
                    <button disabled={loading} type="submit">{loading ? 'Loading...' : 'Register'}</button>
                </form>
                { signUpSuccess && (
                    <div className={styles.modal}>
                        <div className={styles.content}>
                            <h3>
                                User created with administrator previledges with username '{tempUsername}'
                            </h3>
                            <button onClick={ () => setSignUpSuccess(false)}>Ok</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default CreateUser;