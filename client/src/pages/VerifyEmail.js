import React, { useEffect, useContext, useState } from 'react';
import { Link }                                   from "react-router-dom";
import axios                                      from 'axios';
import { SpinnerContext }                         from '../contexts/SpinnerContext';

const VerifyEmail = () => {
  const [showWell, setShowWell] = useState(false);
  const [message, setMessage] = useState({});
  const spinner = useContext(SpinnerContext);

  useEffect(() => {
    const uri = window.location.href.split("#")[1];
    const { _id, email } = JSON.parse(decodeURI(uri));
    spinner.showSpinner();
    axios.post('https://tiote.herokuapp.com/api/users/verify', {
      _id,
      email,
    })
    .then(response => {
      spinner.hideSpinner();
      setMessage({
        title: "Success",
        body: response.data.message
      });
      setShowWell(true);
    })
    .catch(error => {
      spinner.hideSpinner();
      setMessage({
        title: "Error",
        body: error.response.data.message
      });
      setShowWell(true);
    })
  }, [message.body]);

  return (
    <React.Fragment>
      {showWell ?
        <div className="Well">
          <div className="Well__container">
            <h1 className={message.title === "Error" ? "warning" : "success"}>{message.title}</h1>
            <p>{message.body}</p>
            <Link to="/">
              <button>HOME →</button>
            </Link>
          </div>
        </div>
        : null}
    </React.Fragment>
  );
};

export default VerifyEmail;