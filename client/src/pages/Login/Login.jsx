import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';

const Login = () => {

    const history = useHistory();

    const [formValues, setFormValues] = useState({
        id: "",
        password: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        //TODO: Send request to /login, get token, and save it in local storage, then redirect to home page
        localStorage.setItem('jwt', 'this is a token');
        history.push('/');
    }

    const handleChange = (e) => {
        setFormValues( {
            ...formValues,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div>
            <form onSubmit={ (e) => { handleSubmit(e) }}>
                <label>National Id:</label>
                <input type="number" name="id" id="id" value={formValues.id} onChange={ (e) => handleChange(e) }/>
                <label>Password:</label>
                <input type="password" name="password" id="password" value={formValues.password} onChange={ (e) => handleChange(e) }/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
 
export default Login;