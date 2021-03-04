import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { Button, Container, Col, Form } from "react-bootstrap/";

export default function Login() {
  const api_url = process.env.REACT_APP_API_URL;
  const [input, setInput] = useState({ email: "", password: "" });
  const [status, setStatus] = useState();
  const [msg, setMsg] = useState("");
  let history = useHistory();

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
      localStorage.setItem("token", response.data.access_token);
      setStatus(response.data.status);
      setMsg(response.data.result.message);
    });
  }

  useEffect(() => {
    if (!status) return;
    if (status === "success") {
      history.push("/main");
    }
  }, [status]);

  return (
    <>
      <Navbar />
      <Container>
        <Col>
          <Form onSubmit={login}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => inputData("email", e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => inputData("password", e.target.value)}
              />
            </Form.Group>
            {status === "fail" && (
              <Form.Text className="text-danger small">{msg}</Form.Text>
            )}
            <Form.Row className="justify-content-md-center">
              <Button variant="primary" type="submit">
                로그인
              </Button>
            </Form.Row>
            <Form.Row className="justify-content-md-center mt-3">
              <Link to="/register">
                <Button variant="light">회원가입하기</Button>
              </Link>
            </Form.Row>
          </Form>
        </Col>
      </Container>
    </>
  );
}
