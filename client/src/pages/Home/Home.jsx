import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import { UserContext } from '../../helpers/userContext';
const Home = () => {

    const user = useContext(UserContext);

    return (
        <>
            <h1>{user.name}</h1>
            <Link to='/filiation'>/filiation</Link>
            <Link to='/generate'>/generate</Link>
        </>
    );
}
 
export default Home;