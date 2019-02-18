import React from 'react';

const Alert = props => {
  const title = props.error ? 'Error' : 'Success';

  return (
    <div className="Alert">
      <div className="Alert__container">
        <h1
          className={props.error ? "warning" : "success"}
        >
          {title}
        </h1>
        <p>{props.message}</p>
        <button onClick={() => props.close()}>Ok</button>
      </div>
    </div>
  );
};

export default Alert;