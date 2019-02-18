import React, { useState } from 'react';

import Cta      from './Cta';
import Register from './Register';
import Login    from './Login';

const Index = () => {
  let [isRegister, setIsRegister] = useState(true);
  let [animateReg, setAnimateReg] = useState(false);
  let [animateLog, setAnimateLog] = useState(false);

  const showReg = () => {
    setAnimateLog(true);
    setTimeout(() => {
      setIsRegister(true);
      setAnimateLog(false);
    }, 500);
  };

  const showLog = () => {
    setAnimateReg(true);
    setTimeout(() => {
      setIsRegister(false);
      setAnimateReg(false);
    }, 500);
  };

  return (
    <div className="Home">
      <Cta showReg={showReg} showLog={showLog}/>
      {isRegister ? <Register animate={animateReg}/> : <Login animate={animateLog}/>}
    </div>
  );
};

export default Index;