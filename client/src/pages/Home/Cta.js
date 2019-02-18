import React from 'react';

const Cta = props => {
  return (
    <div className="Home-Cta">
      <div>
        <img src={require('../../assets/icons/logo.png')} alt="Logo"/>
        <h1>Have an account?</h1>
        <button className="Button__secondary" onClick={props.showLog}>Login</button>
      </div>
      <div>
        <img src={require('../../assets/icons/logo.png')} alt="Logo"/>
        <h1>Don't have an account?</h1>
        <button className="Button__secondary" onClick={props.showReg}>Register</button>
      </div>
    </div>
  );
};

export default Cta;