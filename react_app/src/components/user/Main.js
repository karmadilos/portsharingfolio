import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const params = useParams();
  const user_id = params.user_id;
  const [loggedin, setLoggedin] = useState();
  const [output, setOutput] = useState({
    email: "",
    name: "",
    image_path: "",
    info: "",
  });

  const [isToggled, setIsToggled] = useState(false);
  const [isEdittable, setIsEdittable] = useState(false);

  useEffect(() => {
    if (user_id === undefined) {
      axios.get(api_url + `main`, options).then((response) => {
        setOutput(response.data.user);
        setLoggedin(response.data.logged_in_as);
        setIsEdittable(true);
      });
    } else {
      axios.get(api_url + `main/${user_id}`, options).then((response) => {
        setOutput(response.data.user);
        setLoggedin(response.data.logged_in_as);
      });
    }
  }, [user_id]);

  useEffect(() => {
    if (loggedin === parseInt(user_id)) {
      setIsEdittable(true);
    }
  }, [loggedin]);

  return (
    <div className="root">
      <Navbar />
      <Container fluid>
        <Row>
          <Col lg={3} md={3}>
            <Card className="mb-2">
              {isToggled ? (
                <MainForm
                  output={output}
                  setOutput={setOutput}
                  isToggled={isToggled}
                  setIsToggled={setIsToggled}
                />
              ) : (
                <Card.Body>
                  <Row className="justify-content-md-center">
                    <img
                      width="64"
                      height="64"
                      className="mb-3"
                      src={output.image_path}
                      alt="profile"
                    />
                  </Row>
                  <Card.Title>{output.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {output.email}
                  </Card.Subtitle>
                  <Card.Text>{output.info}</Card.Text>
                  {isEdittable && (
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
                  )}
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

function MainForm({ output, setOutput, isToggled, setIsToggled }) {
  const api_url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  function updateImg(e) {
    e.preventDefault();
    // todo: 이미지 업로드
  }

  const inputData = (key, data) => {
    setOutput({
      ...output,
      [key]: data,
    });
  };

  function edit(e) {
    e.preventDefault();
    const data = {
      name: output.name,
      info: output.info,
      // image_path: output.image_path
    };
    axios.patch(api_url + "main", data, options);
    setIsToggled(false);
  }
  return (
    <Card.Body>
      <Form onSubmit={edit}>
        <Form.Group controlId="formBasicImage">
          <Row className="justify-content-md-center">
            <img
              width="64"
              height="64"
              className="mb-3"
              src={output.image_path}
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
            value={output.name}
            onChange={(e) => inputData("name", e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Control type="email" value={output.email} />
        </Form.Group>
        <Form.Group controlId="formBasicDescription">
          <Form.Control
            type="text"
            value={output.info}
            onChange={(e) => inputData("info", e.target.value)}
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
  );
}
