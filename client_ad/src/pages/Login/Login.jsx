import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {

    const history = useHistory();

    const [formValues, setFormValues] = useState({
        username: "",
        password: ""
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        //TODO: Send request to /login, get token, and save it in local storage, then redirect to home page
        setLoading(true);
        axios.post('http://localhost:5005/login', formValues).then((res) => {
            localStorage.setItem('jwt', res.data.access_token);
            history.push('/');
        }).catch((error) => {
            if (error.response.data) {
                setMsg(error.response.data.msg);
            }
            else
                setMsg("Unknown Error");
            setLoading(false);
        })
    }

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Login</h1>
            </div>
            <div className={styles.main}>
                <h2>Login as an administrator</h2>
                <form onSubmit={(e) => { handleSubmit(e) }}>
                    <label>Username:</label>
                    <input name="username" id="username" value={formValues.username} onChange={(e) => handleChange(e)} />
                    <label>Password:</label>
                    <input type="password" name="password" id="password" value={formValues.password} onChange={(e) => handleChange(e)} />
                    {msg && <p>{msg}</p>}
                    {loading && <p>Loading...</p>}
                    <button disabled={loading} type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;