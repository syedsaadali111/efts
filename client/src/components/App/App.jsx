import './App.css';
import CreateEntry from '../../pages/CreateEntry/CreateEntry';
import {Switch, Route, Redirect} from 'react-router-dom';
import GenerateCode from '../../pages/GenerateCode/GenerateCode';
import Login from '../../pages/Login/Login';
import AuthProvider from '../../components/AuthProvider/AuthProvider';
import Home from '../../pages/Home/Home';
import SignUp from '../../pages/SignUp/SignUp';
import Navbar from '../../components/Navbar/Navbar';
import Verify from '../../pages/Verify/Verify';

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
          <Navbar></Navbar>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/filiation">
            <CreateEntry />
          </Route>
          <Route path="/generate">
            <GenerateCode />
          </Route>
          <Route path="/risk">
            <Verify />
          </Route>
        </AuthProvider>
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
