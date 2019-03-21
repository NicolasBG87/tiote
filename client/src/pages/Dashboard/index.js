import React, { useContext } from "react";
import Header from "./Header";
import Navigation from "./Navigation";

import { Auth } from "../../contexts/Auth";

const Index = () => {
  const auth = useContext(Auth);
  return (
    <div className="Dashboard">
      <Header auth={auth} />
      <Navigation />
    </div>
  );
};

export default Index;
