import React, { useState } from 'react';
import Spinner             from '../components/Spinner';

export const SpinnerContext = React.createContext();
export const SpinnerProvider = props => {
  let [spinner, setSpinner] = useState(false);

  const showSpinner = () => {
    setSpinner(true);
  };

  const hideSpinner = () => {
    setSpinner(false);
  };

  return (
    <React.Fragment>
      <SpinnerContext.Provider
        value={{
          showSpinner,
          hideSpinner
        }}
      >
        {spinner ? <Spinner/> : null}
        {props.children}
      </SpinnerContext.Provider>
    </React.Fragment>
  );
};