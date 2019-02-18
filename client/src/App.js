import React                         from 'react';
import { Switch, Route, withRouter } from "react-router-dom";

import { SpinnerProvider } from './contexts/SpinnerContext';
import { AlertProvider }   from './contexts/AlertContext';
import Home                from './pages/Home';
import VerifyEmail         from './pages/VerifyEmail';

const App = () => {
  return (
    <SpinnerProvider>
      <AlertProvider>
        <div className="App">
          <Switch>
            <Route path="/verifyEmail" component={VerifyEmail}/>
            <Route path="/" exact={true} component={Home}/>
          </Switch>
        </div>
      </AlertProvider>
    </SpinnerProvider>
  );
};

export default withRouter(App);
