import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../auth/Navbar";
import Education from "./Education";
import Awards from "./Awards";
import Project from "./Project";
import Certificate from "./Certificate";
import { Button, Card, Container, Col, Row, Form } from "react-bootstrap/";

export default function Main() {
  const api_url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [info, setInfo] = useState("");

  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    axios.get(api_url + "main", options).then((response) => {
      setEmail(response.data.email);
      setName(response.data.name);
      setPath(response.data.image_path);
      setInfo(response.data.info);
    });
  }, []);

  function updateImg(e) {
    e.preventDefault();
  }

  function edit(e) {
    e.preventDefault();
    const data = {
      name: name,
      info: info,
      // path: path
    };
    axios.patch(api_url + "main", data, options);
    setIsToggled(false);
  }

  return (
    <div className="root">
      <Navbar />
      <Container fluid>
        <Row>
          <Col lg={3} md={3}>
            <Card className="mb-2">
              {isToggled ? (
                <Card.Body>
                  <Form onSubmit={edit}>
                    <Form.Group controlId="formBasicImage">
                      <Row className="justify-content-md-center">
                        <img
                          width="64"
                          height="64"
                          className="mb-3"
                          src={path}
                          alt="profile"
                          onMouseOver={(e) => {
                            e.target.style.opacity = 0.5;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.opacity = 1;
                          }}
                          onClick={updateImg}
                        />
                      </Row>
                      {/* <Form.File
                          id="custom-file"
                          label="Select file"
                          accept="image/jpeg, image/jpg, image/PNG, image/GIF, image/TIF"
                          lang="en"
                          custom
                          onChange={(e) => setPath(e.target.files[0])}
                        /> */}
                    </Form.Group>
                    <Form.Group controlId="formBasicName">
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Control type="email" value={email} />
                    </Form.Group>
                    <Form.Group controlId="formBasicDescription">
                      <Form.Control
                        type="text"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Row className="justify-content-md-center">
                      <Button className="mr-2" type="submit" variant="primary">
                        확인
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsToggled(!isToggled)}
                      >
                        취소
                      </Button>
                    </Form.Row>
                  </Form>
                </Card.Body>
              ) : (
                <Card.Body>
                  <Row className="justify-content-md-center">
                    <img
                      width="64"
                      height="64"
                      className="mb-3"
                      src={path}
                      alt="profile"
                    />
                  </Row>
                  <Card.Title>{name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {email}
                  </Card.Subtitle>
                  <Card.Text>{info}</Card.Text>
                  <Row className="justify-content-md-center">
                    <Button
                      type="button"
                      variant="link"
                      className="btn-sm"
                      onClick={() => setIsToggled(!isToggled)}
                    >
                      Edit
                    </Button>
                  </Row>
                </Card.Body>
              )}
            </Card>
          </Col>
          <Col>
            <Education />
            <Awards />
            <Project />
            <Certificate />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
