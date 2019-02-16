import React, { useState } from 'react';

import Cta from './Cta';
import Register from './Register';
import Login from './Login';

const Index = () => {
  let [isRegister, setIsRegister] = useState(true);

  const toggleView = () => {
    setIsRegister(!isRegister);
  };
  return (
    <div className="Home">
      <Cta toggleView={toggleView} />
      {isRegister ? <Register /> : <Login />}
    </div>
  );
};

export default Index;