import React, {useState} from 'react';
import styles from './SignUp.module.css';
import axios from 'axios';
import {Link} from 'react-router-dom';

const SignUp = () => {

    const isValidEmail = (email) => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const [formState, setFormState] = useState(
        {
            name: "",
            context: "",
            rule_issuer: false,
            description: "",
            email: "",
            address: "",
            phone: "",
            password: "",
            password2: ""
        }
    );
    const [msg,setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);

    // const history = useHistory();

    const handleChange = (e) => {
        setFormState( {
            ...formState,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        });
    }

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        console.log("submit");
        if (
            formState.name &&
            formState.context &&
            formState.address &&
            formState.description &&
            formState.email &&
            formState.phone &&
            formState.password &&
            formState.password2
        ) {

            if (formState.password !== formState.password2) {
                setMsg("Passwords do not match");
                setLoading(false);
                return;
            }

            if (!isValidEmail(formState.email)){
                setMsg("Email is invalid");
                setLoading(false);
                return;
            }

            const userData = {...formState};
            console.log(userData);
            axios.post('http://localhost:5004/signup', userData).then( (res) => {
                setMsg('User Created Successfully.');
                setFormState(
                    {
                        name: "",
                        context: "",
                        rule_issuer: false,
                        description: "",
                        email: "",
                        address: "",
                        phone: "",
                        password: "",
                        password2: ""
                    }
                );
                setLoading(false);
                setRegisterSuccess(true);
            }).catch( () => {
                setMsg('Email is already in use.');
                setLoading(false);
            })
        } else {
            setMsg("All fields are required");
            setLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Register a public institute</h1>
            </div>
            <div className={styles.main}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="name">Institute title</label>
                    <input value={formState.name} onChange={e => handleChange(e)} id="name" name="name" placeholder="e.g. Health Ministry" />
                    <label htmlFor="description">Description</label>
                    <input value={formState.description} onChange={e => handleChange(e)} id="description" name="description" placeholder="Institute description"/>
                    <label htmlFor="address">Address</label>
                    <input value={formState.address} onChange={e => handleChange(e)} id="address" name="address" placeholder="Institute address"/>
                    <label htmlFor="email">Email Address</label>
                    <input value={formState.email} onChange={e => handleChange(e)} id="email" name="email" placeholder="someone@example.com" />
                    <label htmlFor="phone">Phone Number</label>
                    <div className={styles.phone}>
                        <label htmlFor="phone">+90</label>
                        <input value={formState.phone} type="number" onChange={e => handleChange(e)} id="phone" name="phone"/>
                    </div>
                    <div className={styles.optionContainer}>
                        <div className={styles.inner}>
                            <label htmlFor="context">Context</label>
                            <select onChange={e => handleChange(e)} id="context" name="context" value={formState.context}>
                                <option value="">&lt;choose&gt;</option>
                                <option value="health">Health</option>
                                <option value="food">Food</option>
                                <option value="recreational">Recreational</option>
                                <option value="travel">Travel</option>
                            </select>
                        </div>
                        <div className={styles.inner}>
                            <label htmlFor="rule_issuer">Rule Issuer</label>
                            <input name="rule_issuer" id="rule_issuer" type="checkbox" checked={formState.rule_issuer} onChange={e => handleChange(e)}></input>
                        </div>
                    </div>
                    <label htmlFor="password">Password</label>
                    <input value={formState.password} onChange={e => handleChange(e)} type="password" id="password" name="password"/>
                    <label htmlFor="password2">Confirm Password</label>
                    <input value={formState.password2} onChange={e => handleChange(e)} type="password" id="password2" name="password2"/>
                    {msg && <p>{msg}</p>}
                    <button disabled={loading} type="submit">{loading ? 'Loading...' : 'Register'}</button>
                </form>
                { registerSuccess && (
                    <div className={styles.modal}>
                        <div className={styles.content}>
                            <h3>
                                A confirmation link has been sent to you on your email. You need to verify
                                your email by clicking on the link before logging in.
                            </h3>
                            <Link to="/login">
                                <button>Ok</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default SignUp;