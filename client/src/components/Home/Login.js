import React, { useState, useEffect } from 'react';
import validator                      from '../../helpers/validator';

const Register = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [formValidity, setFormValidity] = useState({
    email: false,
    password: false,
  });
  let [isValid, setIsValid] = useState(false);

  /**
   * Check form validity on component updates
   */
  useEffect(() => {
    const values = Object.values(formValidity);
    values.includes(false) ? setIsValid(false) : setIsValid(true);
  });

  /**
   *
   * @param {Event} e - event triggered from input fields
   * @param {Function} callback - hook that sets input value
   */
  const inputValidators = (e, callback) => {
    let { name, value } = e.target;
    callback(value);
    let message = e.target.nextElementSibling; // paragraph containing error message
    message.innerHTML = "&nbsp;"; // set to nbsp so it preserves height
    switch (name) {
      case 'email':
        if (!validator.isEmail(value)) {
          message.innerHTML = "Not a valid email";
          setFormValidity({ ...formValidity, email: false });
        } else {
          setFormValidity({ ...formValidity, email: true });
        }
        break;
      case 'password':
        if (!validator.isPassword(value)) {
          message.innerHTML = "Uppercase, lowercase, number and 8-25 characters long";
          setFormValidity({ ...formValidity, password: false });
        } else {
          setFormValidity({ ...formValidity, password: true });
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="Login">
      <h1>Login</h1>
      <form>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => inputValidators(e, setEmail)}
          />
          <p>&nbsp;</p>
          <img src={require('../../assets/icons/email.svg')} alt="Email"/>
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => inputValidators(e, setPassword)}
          />
          <p>&nbsp;</p>
          <img src={require('../../assets/icons/password.svg')} alt="Password"/>
        </div>
        <button disabled={!isValid}>Login</button>
      </form>
    </div>
  );
};

export default Register;