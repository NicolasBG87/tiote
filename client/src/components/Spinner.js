import React from 'react';

const Spinner = () => {
  return (
    <div className="Spinner">
      <div className="lds-css ng-scope">
        <div className="lds-spinner">
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;