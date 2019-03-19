import React, {useContext} from 'react';
import {Switch, Route, withRouter} from "react-router-dom";

import {SpinnerProvider} from './contexts/SpinnerContext';
import {AlertProvider} from './contexts/AlertContext';
import {Auth} from './contexts/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const App = () => {
    const {user} = useContext(Auth);
    return (
        <SpinnerProvider>
            <AlertProvider>
                <div className="App">
                    <Switch>
                        <Route path="/" exact={true} render={props => <Home {...props}/>}/>
                        <Route path="/dashboard" exact={true} component={user ? Dashboard : Home}/>
                    </Switch>
                </div>
            </AlertProvider>
        </SpinnerProvider>
    );
};

export default withRouter(App);
