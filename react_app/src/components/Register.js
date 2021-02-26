import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const api_url = "http://localhost:5000/";
  const [input, setInput] = useState({
    email: "",
    password: "",
    password_confirm: "",
    name: "",
  });
  const [status, setStatus] = useState();
  const [msg, setMsg] = useState("");

  const inputData = (key, data) => {
    setInput({
      ...input,
      [key]: data,
    });
  };

  async function register(e) {
    e.preventDefault();
    const data = {
      email: input.email,
      password: input.password,
      password_confirm: input.password_confirm,
      name: input.name,
    };
    await axios.post(api_url + "register", data).then((response) => {
      console.log(JSON.stringify(response));
      setStatus(response.data.status);
      setMsg(response.data.message);
    });
    execute();
  }

  function execute() {
    alert(msg);
    if (status === "success") {
      return <Redirect to="/" />;
    }
  }

  return (
    <article>
      <form onSubmit={register}>
        <div>
          <label>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={(e) => inputData("email", e.target.value)}
          />
          <p>Check your email.</p>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={(e) => inputData("password", e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="password_confirm"
            placeholder="Password"
            onChange={(e) => inputData("password_confirm", e.target.value)}
          />
          <p>Check your password.</p>
        </div>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={(e) => inputData("name", e.target.value)}
          />
        </div>
        <div>
          <button type="submit">회원가입</button>
        </div>
      </form>
    </article>
  );
}
