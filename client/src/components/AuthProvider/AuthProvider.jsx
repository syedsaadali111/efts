import React, { Component } from 'react';
import { getJWT } from '../../helpers/jwt';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../../helpers/userContext';

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
        console.log(jwt);
        if (!jwt) {
            this.props.history.push('/login');
        }

        //TODO: send request to /getUser, set state to the returned user info.
        // If error in request, remove jwt and redirect to /login,
        
        this.setState({
            ...this.state,
            user: {
                id: '99542836758',
                name: 'Syed Saad Ali',
                eftsCode: 'EFTS-1111-1111-1111'
            }
        });

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