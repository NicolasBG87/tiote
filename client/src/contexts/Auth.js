import React, { useState } from "react";

export const Auth = React.createContext();
export const AuthProvider = props => {
  let [user, setUser] = useState(null);
  let [token, setToken] = useState("");

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <Auth.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout
      }}
    >
      {props.children}
    </Auth.Provider>
  );
};
