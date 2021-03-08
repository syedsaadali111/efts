import React, {useState} from 'react';
import styles from './Login.module.css';
import {useHistory, Link} from 'react-router-dom';

const Login = () => {


    const history = useHistory();

    const [formValues, setFormValues] = useState({
        id: "",
        password: ""
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        //TODO: Send request to /login, get token, and save it in local storage, then redirect to home page
        setLoading(true);
        console.log("submit");
        // axios.post('http://localhost:5003/login', formValues).then( (res) => {
        //     localStorage.setItem('jwt', res.data.access_token);
        //     history.push('/');
        // }).catch( () => {
        //     setMsg("Invalid Credentials");
        //     setLoading(false);
        // })
    }

    const handleChange = (e) => {
        setFormValues( {
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
                <h2>Login as a public institute</h2>
                <form onSubmit={ (e) => { handleSubmit(e) }}>
                    <label>National Id:</label>
                    <input type="number" name="id" id="id" placeholder="9xxxxxxxxxx" value={formValues.id} onChange={ (e) => handleChange(e) }/>
                    <label>Password:</label>
                    <input type="password" name="password" id="password" value={formValues.password} onChange={ (e) => handleChange(e) }/>
                    {msg && <p>{msg}</p>}
                    {loading && <p>Loading...</p>}
                    <button disabled={loading} type="submit">Login</button>
                </form>
                <p>If you have not registered yourself to the system, do it <Link to="/signup">here</Link></p>
            </div>
        </div>
    );
}
 
export default Login;