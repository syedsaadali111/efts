import React, { /*useEffect,*/ useState } from 'react';
import styles from './Report.module.css';
import axios from 'axios';
import Collapsible from '../../components/Collapsible/Collapsible';

const Report = () => {

    const [data, setData] = useState([]);
    const [loading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [id, setId] = useState('');

    // useEffect(() => {
    //     setIsLoading(true);

    //     axios.get('http://localhost:5000/report', {
    //         params: {
    //             id: 99542836758
    //         }
    //     }).then( ({data}) => {
    //         setIsLoading(false);
    //         console.log(data);
    //         setData(data.records);
    //     }).catch( (e) => {
    //         if(e?.response?.data?.msg)
    //             setMsg(e.response.data.msg);
    //         else
    //             setMsg('Unknowm error occured, try again in a while');
    //         setIsLoading(false);
    //     });
    // }, [])

    const handleSearch = (e) => {
        setData([]);
        setIsLoading(true);
        setMsg('');
        if (id.length < 11 || id.length > 11 ) {
            setMsg("Please enter a valid citizen ID");
            setIsLoading(false);
        }
        else {
            axios.get('http://localhost:5000/report', {
                params: {
                    id: parseInt(id)
                }
            }).then(({ data }) => {
                setIsLoading(false);
                console.log(data);
                setData(data.records);
                if (!data.records.length)
                    setMsg('No contact tracing data found');
            }).catch((e) => {
                if (e?.response?.data?.msg)
                    setMsg(e.response.data.msg);
                else
                    setMsg('Unknowm error occured, try again in a while');
                setIsLoading(false);
            });
        }
    }

    const handleChange = (e) => {
        setId(e.target.value);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Contact History</h1>
            </div>
            <div className={styles.main}>
                <h2>Search by Citizen ID</h2>
                <div className={styles.inputContainer}>
                    <input placeholder="99xxxxxxxxx" type="number" value={id} onChange={handleChange}></input>
                    <button onClick={handleSearch}>Search</button>
                </div>
                {data.map((r) => {
                    return (
                        <Collapsible heading={
                            new Date(r.relationship.timestamp).toString().split('GMT')[0] +
                            ' [' + daysPast(r.relationship.timestamp) + ']'
                        }>
                            <div className={styles.row}>
                                <div>
                                    <span className={styles.label}>Citizen Id:</span>
                                    <span>{r.citizenId}</span>
                                </div>
                                <div>
                                    <span className={styles.label}>Duration:</span>
                                    <span>{durationString(r.relationship.duration)}</span>
                                </div>
                                <div>
                                    <span className={styles.label}>Outdoors:</span>
                                    <span>{r.relationship.outdoors ? 'Yes' : 'No'}</span>
                                </div>
                                <div>
                                    <span className={styles.label}>Degree Of Contact:</span>
                                    <span>{r.degreeOfContact}</span>
                                </div>
                            </div>
                        </Collapsible>
                    )
                })
                }
                {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
                <p style={{ textAlign: 'center' }}>{msg}</p>
            </div>
        </div>
    );
}

const durationString = (duration) => {
    switch (duration) {
        case 'low':
            return '<= 5 minutes';
        case 'mid':
            return '<= 15 minutes';
        case 'high':
            return '> 15 minutes';
        default:
            return duration;
    }
}

const daysPast = (timestamp) => {
    const now = new Date().getTime();
    const daysPast = (now - timestamp) / (3600 * 24 * 1000);
    if (daysPast < 1) {
        return 'Less than a day ago';
    }
    if (daysPast === 1) {
        return Math.floor(daysPast) + ' day ago';
    }

    return Math.floor(daysPast) + ' days ago';
}

export default Report;