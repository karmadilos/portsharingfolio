import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Container, Col, Form, Row } from "react-bootstrap/";

export default function Register() {
  const api_url = process.env.REACT_APP_API_URL;
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

  async function register(e) {
    e.preventDefault();
    const data = {
      email: input.email,
      password: input.password,
      password_confirm: input.password_confirm,
      name: input.name,
    };
    await axios.post(api_url + "register", data).then((response) => {
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
                ????????????
              </Button>
            </Form.Row>
          </Form>
          <Row className="justify-content-md-center mt-3">
            <a href="#" onClick={() => history.push("/")}>
              ?????? ???????????? ?????????????
            </a>
          </Row>
        </Col>
      </Container>
    </>
  );
}
