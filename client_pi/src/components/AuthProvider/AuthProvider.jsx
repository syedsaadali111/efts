import React, { Component } from 'react';
import { getJWT } from '../../helpers/jwt';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../../helpers/userContext';
import axios from 'axios';

class AuthProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: undefined
        }
    }

    componentDidMount() {
        //get jwt
        const jwt = getJWT();
        console.log("jwt", jwt );
        if (jwt == null) {
            this.props.history.push('/login');
        } else {
            axios.get('http://localhost:5004/getInfo', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }).then( (res) => {
                console.log(res.data);
                this.setState({
                    ...this.state,
                    user: res.data
                });
            }).catch( () => {
                localStorage.removeItem('jwt');
                this.props.history.push('/login');
            });

        }
    }
    
    render() { 

        if (this.state.user === undefined) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <UserContext.Provider value={this.state.user}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}
 
export default withRouter(AuthProvider);