import React, { useState, useEffect, useContext } from "react";
import validator from "../../helpers/validator";
import axios from "axios";
import { SpinnerContext } from "../../contexts/SpinnerContext";
import { AlertContext } from "../../contexts/AlertContext";

const Register = props => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [passwordConfirm, setPasswordConfirm] = useState("");
  let [secretQuestion, setSecretQuestion] = useState("Your first car");
  let [secretAnswer, setSecretAnswer] = useState("");
  let [formValidity, setFormValidity] = useState({
    name: false,
    email: false,
    password: false,
    passwordConfirm: false,
    secretAnswer: false
  });
  let [isValid, setIsValid] = useState(false);
  const spinner = useContext(SpinnerContext);
  const alert = useContext(AlertContext);

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
      case "name":
        if (!validator.isFullName(value)) {
          message.innerHTML = "Must be between 8 and 35 characters long";
          setFormValidity({
            ...formValidity,
            name: false
          });
        } else {
          setFormValidity({
            ...formValidity,
            name: true
          });
        }
        break;
      case "email":
        if (!validator.isEmail(value)) {
          message.innerHTML = "Not a valid email";
          setFormValidity({
            ...formValidity,
            email: false
          });
        } else {
          setFormValidity({
            ...formValidity,
            email: true
          });
        }
        break;
      case "password":
        if (!validator.isPassword(value)) {
          message.innerHTML =
            "Uppercase, lowercase, number and 8-25 characters long";
          setFormValidity({
            ...formValidity,
            password: false
          });
        } else {
          setFormValidity({
            ...formValidity,
            password: true
          });
        }
        break;
      case "passwordConfirm":
        if (value !== password) {
          message.innerHTML = "Passwords don't match";
          setFormValidity({
            ...formValidity,
            passwordConfirm: false
          });
        } else {
          setFormValidity({
            ...formValidity,
            passwordConfirm: true
          });
        }
        break;
      default:
        if (!validator.isNotEmpty(value)) {
          message.innerHTML = "Cannot be empty";
          setFormValidity({
            ...formValidity,
            secretAnswer: false
          });
        } else {
          setFormValidity({
            ...formValidity,
            secretAnswer: true
          });
        }
        break;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    spinner.showSpinner();
    axios
      .post("http://localhost:8080/api/users/register", {
        name,
        email,
        password,
        secretQuestion,
        secretAnswer
      })
      .then(response => {
        spinner.hideSpinner();
        alert.setError(false);
        alert.setMessage(response.data.message);
        alert.showAlert();
      })
      .catch(error => {
        spinner.hideSpinner();
        alert.setError(true);
        alert.setMessage(error.response.data.message);
        alert.showAlert();
      });
  };

  return (
    <div className={`Register ${props.animate ? "Register__animated" : ""}`}>
      <h1>Register</h1>
      <form onSubmit={e => handleSubmit(e)}>
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={e => inputValidators(e, setName)}
          />
          <p>&nbsp;</p>
          <img src={require("../../assets/icons/name.svg")} alt="Name" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => inputValidators(e, setEmail)}
          />
          <p>&nbsp;</p>
          <img src={require("../../assets/icons/email.svg")} alt="Email" />
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
          <img
            src={require("../../assets/icons/password.svg")}
            alt="Password"
          />
        </div>
        <div className="input-group">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={e => inputValidators(e, setPasswordConfirm)}
          />
          <p>&nbsp;</p>
          <img
            src={require("../../assets/icons/password.svg")}
            alt="Password"
          />
        </div>
        <div className="Register__sqa">
          <select
            name="secretQuestion"
            value={secretQuestion}
            onChange={e => setSecretQuestion(e.target.value)}
          >
            <option value="" disabled={true}>
              --Secret Question--
            </option>
            <option value="Your first car">Your first car</option>
            <option value="Your first pet's name">Your first pet's name</option>
            <option value="Your favorite song">Your favorite song</option>
            <option value="Your mother's middle name">
              Your mother's middle name
            </option>
          </select>
          <div className="input-group">
            <input
              className="secretAnswer"
              type="text"
              name="secretAnswer"
              value={secretAnswer}
              onChange={e => inputValidators(e, setSecretAnswer)}
            />
            <img
              src={require("../../assets/icons/question.svg")}
              alt="Secret Answer"
            />
            <p>&nbsp;</p>
          </div>
        </div>
        <button disabled={!isValid}>Register</button>
      </form>
    </div>
  );
};

export default Register;
