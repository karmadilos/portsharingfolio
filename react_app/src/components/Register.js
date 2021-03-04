import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Container, Col, Form } from "react-bootstrap/";

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
  let history = useHistory();

  const inputData = (key, data) => {
    setInput({
      ...input,
      [key]: data,
    });
  };

  function register(e) {
    e.preventDefault();
    const data = {
      email: input.email,
      password: input.password,
      password_confirm: input.password_confirm,
      name: input.name,
    };
    axios.post(api_url + "register", data).then((response) => {
      console.log(JSON.stringify(response));
      setStatus(response.data.status);
      setMsg(response.data.message);
    });
  }
  if (status === "success") {
    history.push("/");
  }

  return (
    <>
      <Navbar />
      <Container>
        <Col>
          <Form onSubmit={register}>
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
            <Form.Group controlId="formBasicPasswordConfirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => inputData("password_confirm", e.target.value)}
              />
              {input.password !== input.password_confirm && (
                <Form.Text className="text-muted small">
                  Check your password.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) => inputData("name", e.target.value)}
              />
            </Form.Group>
            {status === "fail" && (
              <Form.Text className="text-danger small">{msg}</Form.Text>
            )}
            <Form.Row className="justify-content-md-center">
              <Button variant="primary" type="submit">
                회원가입
              </Button>
            </Form.Row>
          </Form>
        </Col>
      </Container>
    </>
  );
}
