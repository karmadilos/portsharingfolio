import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { Button, Container, Col, Form, Modal } from "react-bootstrap/";

export default function Login() {
  const api_url = process.env.REACT_APP_API_URL;
  const [input, setInput] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [report, setReport] = useState(0);
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  let history = useHistory();

  const inputData = (key, data) => {
    setInput({
      ...input,
      [key]: data,
    });
  };

  const handleClose = () => setShow(false);

  async function login(e) {
    e.preventDefault();
    const data = { email: input.email, password: input.password };
    await axios.post(api_url + "login", data).then((response) => {
      localStorage.setItem("token", response.data.access_token);
      setReport(response.data.report_count);
      setStatus(response.data.status);
      setMsg(response.data.result.message);
    });
  }

  useEffect(() => {
    if (!status) return;

    if (status === "success") {
      if (report > 0) {
        setShow(true);
      } else {
        history.push("/main");
      }
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
                value={input.email}
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
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>{report}번 신고당하셨습니다!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {3 - report}번 더 신고당하시면 계정이 삭제됩니다!
            <br /> 3회 이상 신고 처리 당한 사용자의 계정은 삭제 조치 됩니다.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShow(false);
                history.push("/main");
              }}
            >
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
