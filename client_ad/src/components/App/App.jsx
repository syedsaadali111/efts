import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from '../../pages/Login/Login.jsx';
import SignUp from '../../pages/SignUp/SignUp';
import Home from '../../pages/Home/Home';
import AuthProvider from '../../components/AuthProvider/AuthProvider';
import Requests from '../../pages/Requests/Requests';
import CreateUser from '../../pages/CreateUser/CreateUser';

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <AuthProvider>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/requests">
            <Requests />
          </Route>
          <Route path="/users">
            <CreateUser />
          </Route>
        </AuthProvider>
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
