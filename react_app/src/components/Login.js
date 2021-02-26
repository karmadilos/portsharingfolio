import React, { useState } from "react";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login() {
  const api_url = "http://localhost:5000/";
  const [input, setInput] = useState({ email: "", password: "" });
  const [status, setStatus] = useState();
  const [msg, setMsg] = useState("");

  const inputData = (key, data) => {
    setInput({
      ...input,
      [key]: data,
    });
  };

  async function login(e) {
    e.preventDefault();
    const data = { email: input.email, password: input.password };
    await axios.post(api_url + "login", data).then((response) => {
      console.log(JSON.stringify(response));
      localStorage.setItem("token", response.data.access_token);
      setStatus(response.data.status);
      setMsg(response.data.result.message);
    });
    execute();
  }

  function execute() {
    if (status === "success") {
      return <h1>hi</h1>;
    }
    alert(msg);
  }

  return (
    <>
      <Nav />
      <article>
        <form onSubmit={login}>
          <div>
            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={(e) => inputData("email", e.target.value)}
            />
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
            <button type="submit">로그인</button>
            <Link to="/register">
              <button>회원가입하기</button>
            </Link>
          </div>
        </form>
      </article>
    </>
  );
}
