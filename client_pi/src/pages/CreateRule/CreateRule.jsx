import React, {useState} from 'react';
import styles from './CreateRule.module.css';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {Multiselect} from 'multiselect-react-dropdown';

const multiselectStyles = {
    multiselectContainer: {
        marginTop: "20px",
    },
    searchBox: {
        border: "1px solid white",
        background: "white",
        borderRadius: "5px"
    },
    chips: {
        background: "#ff4129"
    },
    option: {
        color: "white",
        fontWeight: "bold"
    },
    optionContainer: {
        background: "#666"
    }
}

const days = [
    { value: 1, label: "Monday"},
    { value: 2, label: "Tuesday"},
    { value: 3, label: "Wednesday"},
    { value: 4, label: "Thursday"},
    { value: 5, label: "Friday"},
    { value: 6, label: "Saturday"},
    { value: 7, label: "Sunday"}
];

const zones = [
    "Red",
    "Orange",
    "Yellow",
    "Blue"
];

const occupations = [
    "Front Line Hospital Employee",
    "Police",
    "Military",
    "Paramilitary personnel",
    "Civic worker",
    "Emergency response workers"
]

const CreateRule = () => {

    const [formState, setFormState] = useState(
        {
            id: "",
            p_id: "",
            name: "",
            description: "",
            context: "",
            priority: "",
            startDate: "",
            endDate: "",
            minAge: "",
            maxAge: "",
            timeFrom: "",
            timeTo: "",
            days: [],
            travelFrom: [],
            travelTo: [],
            occupationDeny: []
        }
    );
    const [msg,setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    const history = useHistory();
    
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
            formState.id &&
            formState.p_id &&
            formState.name &&
            formState.description &&
            formState.context &&
            formState.priority &&
            formState.startDate &&
            formState.days.length !== 0
        ) {
    
            const userData = {...formState};
            console.log(userData);
            axios.post('http://localhost:5004/createRule', userData).then( (res) => {
                setMsg('User Created Successfully.');
                setFormState(
                    {
                        id: "",
                        p_id: "",
                        name: "",
                        description: "",
                        context: "",
                        priority: "",
                        startDate: "",
                        endDate: "",
                        minAge: "",
                        maxAge: "",
                        timeFrom: "",
                        timeTo: "",
                        days: [],
                        travelFrom: [],
                        travelTo: [],
                        occupationDeny: []
                    }
                );
                setLoading(false);
                history.push("/login");
            }).catch( () => {
                setMsg('A server error occured, try again in a while.');
                setLoading(false);
            })
        } else {
            setMsg("One or more required fields are missing");
            setLoading(false);
        }
    }

    const handleDaysChange = (data) => {
        console.log(data);
        const newDays = data.map( d => d.value);
        console.log(newDays);
        setFormState({
            ...formState,
            days: newDays
        });
    }
    
    const handleFromZoneChange = (data) => {
        console.log(data);
        const newZones = data;
        console.log(newZones);
        setFormState({
            ...formState,
            travelFrom: newZones
        });
    }

    const handleToZoneChange = (data) => {
        const newZones = data;
        console.log(newZones);
        setFormState({
            ...formState,
            travelTo: newZones
        });
    }

    const handleOccupationChange = (data) => {
        const newOccupations = data;
        setFormState({
            ...formState,
            occupationDeny: newOccupations
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Create a rule</h1>
            </div>
            <div className={styles.main}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor="id">Id</label>
                    <input value={formState.id} type="number" onChange={e => handleChange(e)} id="id" name="id" placeholder="id" />
                    <label htmlFor="p_id">P_id</label>
                    <input value={formState.p_id} type="number" onChange={e => handleChange(e)} id="id" name="p_id" placeholder="p_id" />
                    <label htmlFor="name">*Rule Label</label>
                    <input value={formState.name} onChange={e => handleChange(e)} id="name" name="name" placeholder="e.g. Health Ministry" />
                    <label htmlFor="description">*Description</label>
                    <input value={formState.description} onChange={e => handleChange(e)} id="description" name="description" placeholder="Institute description"/>
                    <div className={styles.optionContainer}>
                        <div className={styles.inner}>
                            <label htmlFor="context">*Context</label>
                            <select onChange={e => handleChange(e)} id="context" name="context" value={formState.context}>
                                <option value="">&lt;choose&gt;</option>
                                <option value="health">Health</option>
                                <option value="food">Food</option>
                                <option value="recreational">Recreational</option>
                                <option value="travel">Travel</option>
                            </select>
                        </div>
                        <div className={styles.inner}>
                        <label htmlFor="priority">*Priority</label>
                            <select onChange={e => handleChange(e)} id="priority" name="priority" value={formState.priority}>
                                <option value="">&lt;choose&gt;</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>   
                        </div>
                    </div>
                    <label htmlFor="startDate">*Applicable from</label>
                    <input value={formState.startDate} type="date" onChange={e => handleChange(e)} id="startDate" name="startDate" placeholder="Date of birth" />
                    <label htmlFor="endDate">Applicable till (leave blank if indefinite)</label>
                    <input value={formState.endDate} type="date" onChange={e => handleChange(e)} id="endDate" name="endDate" placeholder="Date of birth" />
                    <label>Apply rule between these hours<br></br>(Leave blank to apply rule throughout the day):</label>
                    <div className={styles.timeContainer}>
                        <label htmlFor="timeFrom" >From</label>
                        <select name="timeFrom" onChange={e => handleChange(e)} id="timeFrom" value={formState.timeFrom}>
                            <option value="">&lt;choose&gt;</option>
                            <option value="00:00">00:00</option>
                            <option value="01:00">01:00</option>
                            <option value="02:00">02:00</option>
                            <option value="03:00">03:00</option>
                            <option value="04:00">04:00</option>
                            <option value="05:00">05:00</option>
                            <option value="06:00">06:00</option>
                            <option value="07:00">07:00</option>
                            <option value="08:00">08:00</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                            <option value="17:00">17:00</option>
                            <option value="18:00">18:00</option>
                            <option value="19:00">19:00</option>
                            <option value="20:00">20:00</option>
                            <option value="21:00">21:00</option>
                            <option value="22:00">22:00</option>
                            <option value="23:00">23:00</option>
                        </select>
                        <label htmlFor="timeTo" >To</label>
                        <select id="timeTo" name="timeTo" onChange={e => handleChange(e)} value={formState.timeTo}>
                            <option value="">&lt;choose&gt;</option>
                            <option value="00:00">00:00</option>
                            <option value="01:00">01:00</option>
                            <option value="02:00">02:00</option>
                            <option value="03:00">03:00</option>
                            <option value="04:00">04:00</option>
                            <option value="05:00">05:00</option>
                            <option value="06:00">06:00</option>
                            <option value="07:00">07:00</option>
                            <option value="08:00">08:00</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                            <option value="16:00">16:00</option>
                            <option value="17:00">17:00</option>
                            <option value="18:00">18:00</option>
                            <option value="19:00">19:00</option>
                            <option value="20:00">20:00</option>
                            <option value="21:00">21:00</option>
                            <option value="22:00">22:00</option>
                            <option value="23:00">23:00</option>
                        </select>
                    </div>
                    <label>Apply this rule for ages<br></br> (Leave blank to apply to all) </label>
                    <div className={styles.ageContainer}>
                        <label htmlFor="minAge">less than: </label>
                        <input value={formState.minAge} name="minAge" id="minAge" type="number" onChange={e => handleChange(e)} ></input>
                        <label htmlFor="maxAge">greater than: </label>
                        <input value={formState.maxAge} name="maxAge" id="maxAge" type="number" onChange={e => handleChange(e)} ></input>
                    </div>
                    <label htmlFor="days">Rule is applicable on these days of the week</label>
                    <Multiselect
                        options={days}
                        displayValue="label"
                        onSelect={handleDaysChange}
                        onRemove={handleDaysChange}
                        style={multiselectStyles}
                    />
                    <label>Restrict travel from these zones:</label>
                    <Multiselect
                        options={zones}
                        isObject={false}
                        onSelect={handleFromZoneChange}
                        onRemove={handleFromZoneChange}
                        style={multiselectStyles}
                    />
                    <label>Restrict travel to these zones:</label>
                    <Multiselect
                        options={zones}
                        isObject={false}
                        onSelect={handleToZoneChange}
                        onRemove={handleToZoneChange}
                        style={multiselectStyles}
                    />
                    <label>Occupations exempted from this rule:</label>
                    <Multiselect
                        options={occupations}
                        isObject={false}
                        onSelect={handleOccupationChange}
                        onRemove={handleOccupationChange}
                        style={multiselectStyles}
                    />
                    {msg && <p>{msg}</p>}
                    <button disabled={loading} type="submit">Create Rule</button>
                </form>
            </div>
        </div>
    );
}
 
export default CreateRule;