import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Row, Form } from "react-bootstrap/";

export default function Awards() {
  const api_url = "http://localhost:5000/";
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [input, setInput] = useState({
    id: 0,
    title: "",
    description: "",
  });
  const [output, setOutput] = useState([]);
  const [check, setCheck] = useState(0);
  const [option, setOption] = useState("");

  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    axios.get(api_url + "awards", options).then((response) => {
      setOutput(response.data.result);
    });
  }, [check]);

  const awardsList = output.map((award) => (
    <Card.Text>
      <Row className="justify-content-between align-items-center row">
        <Col>
          {award[1]}
          <br />
          <span className="text-muted">{award[2]}</span>
        </Col>
        <Button
          type="button"
          variant="link"
          className="btn-sm mr-3"
          onClick={() => {
            setIsToggled(true);
            setOption("edit");
            setInput({
              id: award[0],
              title: award[1],
              description: award[2],
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
      title: input.title,
      description: input.description,
    };

    if (option === "add") {
      axios.post(api_url + "awards", data, options);
      setInput({ title: "", description: "" });
      setIsToggled(false);
      setCheck(check + 1);
      setInput({ title: "", description: "" });
    } else if (option === "edit") {
      axios.put(api_url + "awards", data, options);
      setIsToggled(false);
      setCheck(check + 1);
      setInput({ title: "", description: "" });
    }
  }

  function clear(e) {
    e.preventDefault();

    axios.delete(api_url + "awards", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id: input.id },
    });
    setIsToggled(false);
    setCheck(check - 1);
    setInput({ title: "", description: "" });
  }

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>수상이력</Card.Title>
        {awardsList}
        {isToggled && (
          <Form onSubmit={add}>
            <Form.Group controlId="formBasicTitle">
              <Form.Control
                type="text"
                name="title"
                placeholder="수상내역"
                value={input.title}
                onChange={(e) => inputData("title", e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicDescription">
              <Form.Control
                type="text"
                name="description"
                placeholder="상세내역"
                value={input.description}
                onChange={(e) => inputData("description", e.target.value)}
              />
            </Form.Group>
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
                  setInput({ title: "", description: "" });
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
              setInput({ title: "", description: "" });
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
