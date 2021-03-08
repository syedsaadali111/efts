import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from '../../pages/Login/Login';
import SignUp from '../../pages/SignUp/SignUp';
import CreateRule from '../../pages/CreateRule/CreateRule';
import AuthProvider from '../AuthProvider/AuthProvider';
import Home from '../../pages/Home/Home';


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
          <Route path="/rule">
            <CreateRule/>
          </Route>
        </AuthProvider>
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
