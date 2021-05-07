import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from '../../pages/Login/Login.jsx';
import Home from '../../pages/Home/Home';
import AuthProvider from '../../components/AuthProvider/AuthProvider';
import Requests from '../../pages/Requests/Requests';
import CreateUser from '../../pages/CreateUser/CreateUser';
import Parameters from '../../pages/Parameters/Parameters';
import Report from '../../pages/Report/Report';
import Navbar from '../../components/Navbar/Navbar';

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <AuthProvider>
          <Navbar></Navbar>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/requests">
            <Requests />
          </Route>
          <Route path="/users">
            <CreateUser />
          </Route>
          <Route path="/parameters">
            <Parameters />
          </Route>
          <Route path="/report">
            <Report />
          </Route>
        </AuthProvider>
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
