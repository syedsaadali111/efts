import './App.css';
import CreateEntry from '../../pages/CreateEntry/CreateEntry';
import {Switch, Route} from 'react-router-dom';
import GenerateCode from '../../pages/GenerateCode/GenerateCode';

function App() {
  return (
    <>
      <Switch>
        <Route path="/filiation">
          <CreateEntry />
        </Route>
        <Route path="/generate">
          <GenerateCode />
        </Route>
        <Route path="/">
          <p>/filiation for creating contact tracing entry</p>
          <p>/generate for code generation</p>
        </Route>
      </Switch>
    </>
  );
}

export default App;
