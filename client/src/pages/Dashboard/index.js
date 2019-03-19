import React, {useContext} from 'react';
import Header from './Header';

import {Auth} from '../../contexts/Auth';

const Index = () => {
    const auth = useContext(Auth);
    return (
        <div className="Dashboard">
            <Header auth={auth}/>
        </div>
    );
};

export default Index;