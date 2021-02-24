import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const api_url = "http://localhost:5000/register";
  const [data, setData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    name: "",
  });

  const inputData = (key, input) => {
    setData({
      ...data,
      [key]: input,
    });
  };

  async function signup(e) {
    e.preventDefault();
    const result = {
      email: data.email,
      password: data.password,
      password_confirm: data.password_confirm,
      name: data.name,
    };
    console.log(result);
    await axios.post(api_url, data).then((response) => {
      console.log(JSON.stringify(response));
    });
  }

  return (
    <article>
      <form onSubmit={signup}>
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
