import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import './assets/sass/index.scss';

import {AuthProvider} from "./contexts/Auth";

ReactDOM.render(
    <BrowserRouter>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </BrowserRouter>
    , document.getElementById('root')
);