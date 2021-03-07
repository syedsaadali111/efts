import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import Login from '../../pages/Login/Login';
import SignUp from '../../pages/SignUp/SignUp';
import CreateRule from '../../pages/CreateRule/CreateRule';


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
        <Route path="/rule">
          <CreateRule/>
        </Route>
        {/* <AuthProvider>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/filiation">
            <CreateEntry />
          </Route>
          <Route path="/generate">
            <GenerateCode />
          </Route>
        </AuthProvider> */}
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
