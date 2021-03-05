import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Row, Form } from "react-bootstrap/";

export default function Education() {
  const api_url = "http://localhost:5000/";
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

  useEffect(() => {
    axios.get(api_url + "education", options).then((response) => {
      setOutput(response.data.result);
    });
  }, [check]);

  const collegList = output.map((edu) => (
    <Card.Text>
      <Row className="justify-content-between align-items-center row">
        <Col>
          {edu[1]}
          <br />
          <span className="text-muted">
            {edu[2]} ({position[edu[3]]})
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
              id: edu[0],
              college: edu[1],
              major: edu[2],
              degree: edu[3],
            });
          }}
        >
          Edit
        </Button>
      </Row>
    </Card.Text>
  ));

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
      setInput({ college: "", major: "", degree: 0 });
      setIsToggled(false);
      setCheck(check + 1);
      setInput({ college: "", major: "", degree: 0 });
    } else if (option === "edit") {
      axios.put(api_url + "education", data, options);
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
                  onClick={clear}
                >
                  삭제
                </Button>
              )}
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
