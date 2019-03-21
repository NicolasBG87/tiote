import React, { useState } from "react";
import Alert from "../components/Alert";

export const AlertContext = React.createContext();
export const AlertProvider = props => {
  let [alert, setAlert] = useState(false);
  let [error, setError] = useState(false);
  let [message, setMessage] = useState("");

  const showAlert = () => setAlert(true);

  const hideAlert = () => setAlert(false);

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        hideAlert,
        setError,
        setMessage
      }}
    >
      {alert ? (
        <Alert error={error} message={message} close={hideAlert} />
      ) : null}
      {props.children}
    </AlertContext.Provider>
  );
};
