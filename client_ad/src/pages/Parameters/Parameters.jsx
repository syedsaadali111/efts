import { useEffect, useState } from 'react';
import Collapsible from '../../components/Collapsible/Collapsible';
import { getJWT } from '../../helpers/jwt';
import styles from './Parameters.module.css';
import axios from 'axios';

const Parameters = () => {

    const [parameters, setParameters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msgs, setMsgs] = useState({
        degree: '',
        duration: '',
        maxDays: '',
        days: '',
        outdoors: '',
    });

    useEffect( () => {
        setLoading(true);
        const jwt = getJWT();
        axios.get('http://localhost:5005/parameters', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
        }).then( ({data}) => {
            setParameters({...destructureParams(data)});
            setLoading(false);
        });
    }, []);

    const update = (e) => {
        const jwt = getJWT();
        setLoading(true);
        setMsgs({
            degree: '',
            duration: '',
            maxDays: '',
            days: '',
            outdoors: '',
        });

        let shouldReturn = false;

        if(e.target.id !== 'maxDays') {
            parameters[e.target.id].risk_levels.forEach( (rl) => {
                if(isNaN(rl)) {
                    shouldReturn = true;
                }
            })
        }

        if(shouldReturn){
            setMsgs({...msgs, [e.target.id]: 'Some values are missing'});
            setLoading(false);
            return;
        }

        if(e.target.id !== 'maxDays' && isNaN(parameters[e.target.id].multiplication_factor)) {
            setMsgs({...msgs, [e.target.id]: 'Some values are missing'});
            setLoading(false);
            return;
        }

        if(e.target.id === 'maxDays' && isNaN(parameters[e.target.id].value)) {
            setMsgs({...msgs, [e.target.id]: 'Some values are missing'});
            setLoading(false);
            return;
        }

        axios.post('http://localhost:5005/parameters', {...parameters[e.target.id]}, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).then(() => {
            setMsgs({...msgs, [e.target.id]: 'Update Successful'});
            setLoading(false);
        }).catch(() => {
            setMsgs({...msgs, [e.target.id]: 'Error. Update Unsuccessful'});
            setLoading(false);
        });
    }

    const handleChange = (e) => {
        console.log(e.target.name.split('_')[0]);
        console.log(e.target.name.split('_')[1]);
        const nameSplit = e.target.name.split('_');
        console.log(parameters[nameSplit[0]]);
        const param = parameters[nameSplit[0]];

        if(nameSplit[1] === 'mf') {
            setParameters({
                ...parameters,
                [nameSplit[0]]: {
                    ...param,
                    multiplication_factor: parseFloat(e.target.value)
                }
            });
            console.log(parameters);
        } else if(nameSplit[1] === 'rl') {
            const newRl = param.risk_levels;
            newRl[nameSplit[2]] = parseFloat(e.target.value);
            console.log('newRl', newRl);
            setParameters({
                ...parameters,
                [nameSplit[0]]: {
                    ...param,
                    risk_levels: newRl
                }
            });
        } else {
            setParameters({
                ...parameters,
                [nameSplit[0]]: {
                    ...param,
                    value: parseFloat(e.target.value)
                }
            });
        }
        
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Risk Factor Calculation</h1>
            </div>
            <div className={styles.main}>
                <h2>Customize how risk factor is calculated</h2>
                {loading && <h3>Loading...</h3>}
                {parameters &&
                <>
                    {/* DAYS */}
                    <Collapsible heading="Days Since Contact">
                        <div className={styles.row}>
                            <label className={styles.subHead} htmlFor="days_mf">Multiplication Factor</label>
                            <input type='number' onChange={handleChange} name="days_mf" id="days_mf" value={parameters.days.multiplication_factor}></input>
                        </div>
                        <label className={styles.subHead}>Risk Levels</label>
                        {
                            parameters.days.risk_levels.map( (r, i) => {
                                return (
                                    <div className={styles.row} key={'days' + i}>
                                        <label htmlFor={"days_rl_" + i}>{daysRlLabels[i]}</label>
                                        <input type='number' onChange={handleChange} name={"days_rl_" + i} value={r}></input>
                                    </div>
                                )
                            })
                        }
                        <button id="days" onClick={update} className={styles.btn} disabled={loading}>Update</button>
                        <span className={styles.msg}>{msgs.days}</span>
                    </Collapsible>

                    {/* DEGREE OF CONTACT */}
                    <Collapsible heading="Degree Of Contact">
                        <div className={styles.row}>
                            <label className={styles.subHead} htmlFor="degree_mf">Multiplication Factor</label>
                            <input type='number' onChange={handleChange} name="degree_mf" id="degree_mf" value={parameters.degree.multiplication_factor}></input>
                        </div>
                        <label className={styles.subHead}>Risk Levels</label>
                        {
                            parameters.degree.risk_levels.map( (r, i) => {
                                return (
                                    <div className={styles.row} key={'degree' + i}>
                                        <label htmlFor={"degree_rl_" + i}>{degreeRlLabels[i]}</label>
                                        <input type='number' onChange={handleChange} name={"degree_rl_" + i} value={r}></input>
                                    </div>
                                )
                            })
                        }
                        <button id="degree" onClick={update} className={styles.btn} disabled={loading}>Update</button>
                        <span className={styles.msg}>{msgs.degree}</span>
                    </Collapsible>

                    {/* DURATION */}
                    <Collapsible heading="Duration Of Contact">
                        <div className={styles.row}>
                            <label className={styles.subHead} htmlFor="duration_mf">Multiplication Factor</label>
                            <input type='number' onChange={handleChange} name="duration_mf" id="duration_mf" value={parameters.duration.multiplication_factor}></input>
                        </div>
                        <label className={styles.subHead}>Risk Levels</label>
                        {
                            parameters.duration.risk_levels.map( (r, i) => {
                                return (
                                    <div className={styles.row} key={'duration' + i}>
                                        <label htmlFor={"duration_rl_" + i}>{durationRlLabels[i]}</label>
                                        <input type='number' onChange={handleChange} name={"duration_rl_" + i} value={r}></input>
                                    </div>
                                )
                            })
                        }
                        <button id="duration" onClick={update} className={styles.btn} disabled={loading}>Update</button>
                        <span className={styles.msg}>{msgs.duration}</span>
                    </Collapsible>

                    {/* OUTDOORS */}
                    <Collapsible heading="Place Of Contact">
                        <div className={styles.row}>
                            <label className={styles.subHead} htmlFor="outdoors_mf">Multiplication Factor</label>
                            <input type='number' onChange={handleChange} name="outdoors_mf" id="outdoors_mf" value={parameters.outdoors.multiplication_factor}></input>
                        </div>
                        <label className={styles.subHead}>Risk Levels</label>
                        {
                            parameters.outdoors.risk_levels.map( (r, i) => {
                                return (
                                    <div className={styles.row} key={'outdoors' + i}>
                                        <label htmlFor={"outdoors_rl_" + i}>{outdoorsRlLabels[i]}</label>
                                        <input type='number' onChange={handleChange} name={"outdoors_rl_" + i} value={r}></input>
                                    </div>
                                )
                            })
                        }
                        <button id="outdoors" onClick={update} className={styles.btn} disabled={loading}>Update</button>
                        <span className={styles.msg}>{msgs.outdoors}</span>
                    </Collapsible>

                    {/* MAX DAYS */}
                    <Collapsible heading="Maximum Days">
                        <div className={styles.row}>
                            <label htmlFor="maxDays_value">Number of days after which an infected person is believed to not transmit the disease</label>
                            <input type='number' onChange={handleChange} name="maxDays_value" id="maxDays_value" value={parameters.maxDays.value}></input>
                        </div>
                        <button id="maxDays" onClick={update} className={styles.btn} disabled={loading}>Update</button>
                        <span className={styles.msg}>{msgs.maxDays}</span>
                    </Collapsible>
                </>
                } 
            </div>
        </div>
    );
}

const daysRlLabels = [
    '<= 3 days',
    '<= 6 days',
    '<= 10 days',
    '<= 14 days',
    '> 14 days',
]

const degreeRlLabels = [
    '1st Degree Contact',
    '2nd Degree Contact',
    '3rd Degree Contact',
    '4th Degree Contact',
]

const durationRlLabels = [
    '<= 5 minutes',
    '<= 15 minutes',
    '> 15 minutes',
]

const outdoorsRlLabels = [
    'Indoors',
    'Outdoors',
]

const destructureParams = (params) => {
    let days, outdoors, duration, degree, maxDays;
    params.forEach( (param) => {
        switch(param.factor_label) {
            case 'days':
                days = param;
                break;
            case 'outdoors':
                outdoors = param;
                break;
            case 'duration':
                duration = param;
                break;
            case 'degree_of_contact':
                degree = param;
                break;
            case 'max_days':
                maxDays = param;
                break;
            default:
                break;
        }
    });
    return {days, outdoors, duration, degree, maxDays};
}

export default Parameters;