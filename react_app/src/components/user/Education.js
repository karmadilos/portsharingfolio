import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Modal, Row, Form } from "react-bootstrap/";

export default function Education() {
  const api_url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [input, setInput] = useState({
    id: 0,
    college: "",
    major: "",
    degree: 0,
  });
  const [output, setOutput] = useState([]);
  const [check, setCheck] = useState(0);
  const [option, setOption] = useState("");
  const position = { 0: "재학중", 1: "학사졸업", 2: "석사졸업", 3: "박사졸업" };

  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get(api_url + "education", options).then((response) => {
      setOutput(response.data.result);
    });
  }, [check]);

  const collegList = output.map((edu, index) => (
    <Card.Text key={index}>
      <Row className="justify-content-between align-items-center row">
        <Col>
          {edu["college"]}
          <br />
          <span className="text-muted">
            {edu["major"]} ({position[edu["degree"]]})
          </span>
        </Col>
        <Button
          type="button"
          variant="link"
          className="btn-sm mr-3"
          onClick={() => {
            setIsToggled(true);
            setOption("edit");
            setInput({
              id: edu["id"],
              college: edu["college"],
              major: edu["major"],
              degree: edu["degree"],
            });
          }}
        >
          Edit
        </Button>
      </Row>
    </Card.Text>
  ));

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const inputData = (key, data) => {
    setInput({
      ...input,
      [key]: data,
    });
  };

  function add(e) {
    e.preventDefault();
    const data = {
      id: input.id,
      college: input.college,
      major: input.major,
      degree: input.degree,
    };

    if (option === "add") {
      axios.post(api_url + "education", data, options);
      setIsToggled(false);
      setCheck(check + 1);
      setInput({ college: "", major: "", degree: 0 });
    } else if (option === "edit") {
      axios.patch(api_url + "education", data, options);
      setIsToggled(false);
      setCheck(check + 1);
      setInput({ college: "", major: "", degree: 0 });
    }
  }

  function clear(e) {
    e.preventDefault();

    axios.delete(api_url + "education", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id: input.id },
    });
    setShow(false);
    setIsToggled(false);
    setCheck(check - 1);
    setInput({ college: "", major: "", degree: 0 });
  }

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>학력</Card.Title>
        {collegList}
        {isToggled && (
          <Form onSubmit={add}>
            <Form.Group controlId="formBasicSchool">
              <Form.Control
                type="text"
                name="college"
                placeholder="학교 이름"
                value={input.college}
                onChange={(e) => inputData("college", e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicMajor">
              <Form.Control
                type="text"
                name="major"
                placeholder="전공"
                value={input.major}
                onChange={(e) => inputData("major", e.target.value)}
              />
            </Form.Group>
            <div className="mb-3">
              <Form.Check
                type="radio"
                name="degree"
                label="재학중"
                inline
                onChange={(e) => inputData("degree", 0)}
              ></Form.Check>
              <Form.Check
                type="radio"
                name="degree"
                label="학사졸업"
                inline
                onChange={(e) => inputData("degree", 1)}
              ></Form.Check>
              <Form.Check
                type="radio"
                name="degree"
                label="석사졸업"
                inline
                onChange={(e) => inputData("degree", 2)}
              ></Form.Check>
              <Form.Check
                type="radio"
                name="degree"
                label="박사졸업"
                inline
                onChange={(e) => inputData("degree", 3)}
              ></Form.Check>
            </div>
            <Form.Row className="justify-content-md-center">
              <Button className="mr-2" type="submit">
                확인
              </Button>
              {option === "edit" && (
                <Button
                  className="mr-2"
                  type="button"
                  variant="danger"
                  onClick={handleShow}
                >
                  삭제
                </Button>
              )}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>정말 삭제하시겠습니까?</Modal.Title>
                </Modal.Header>
                <Modal.Body>삭제하시면 되돌릴 수 없습니다!</Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={clear}>
                    삭제
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    취소
                  </Button>
                </Modal.Footer>
              </Modal>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsToggled(!isToggled);
                  setInput({ college: "", major: "" });
                }}
              >
                취소
              </Button>
            </Form.Row>
          </Form>
        )}
        <Row className="justify-content-md-center mt-3">
          <Button
            type="button"
            onClick={() => {
              setIsToggled(true);
              setInput({ college: "", major: "", degree: 0 });
              setOption("add");
            }}
          >
            +
          </Button>
        </Row>
      </Card.Body>
    </Card>
  );
}
