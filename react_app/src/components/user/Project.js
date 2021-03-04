import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Modal, Row, Form } from "react-bootstrap/";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Project() {
  const api_url = process.env.REACT_APP_API_URL;
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
    startdate: new Date(),
    enddate: new Date(),
  });
  const [output, setOutput] = useState([]);
  const [check, setCheck] = useState(0);
  const [option, setOption] = useState("");

  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get(api_url + "projects", options).then((response) => {
      setOutput(response.data.result);
    });
  }, [check]);

  const projectsList = output.map((project, index) => (
    <Card.Text key={index}>
      <Row className="justify-content-between align-items-center row">
        <Col>
          {project["title"]}
          <br />
          <span className="text-muted">{project["description"]}</span>
          <br />
          <span className="text-muted">
            {project["startdate"]} ~ {project["enddate"]}
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
              id: project["id"],
              title: project["title"],
              description: project["description"],
              startdate: project["startdate"],
              enddate: project["enddate"],
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
      title: input.title,
      description: input.description,
      startdate: input.startdate,
      enddate: input.enddate,
    };

    if (option === "add") {
      axios.post(api_url + "projects", data, options);
      setIsToggled(false);
      setCheck(check + 1);
      setInput({
        title: "",
        description: "",
        startdate: new Date(),
        enddate: new Date(),
      });
    } else if (option === "edit") {
      axios.patch(api_url + "projects", data, options);
      setIsToggled(false);
      setCheck(check + 1);
      setInput({
        title: "",
        description: "",
        startdate: new Date(),
        enddate: new Date(),
      });
    }
  }

  function clear(e) {
    e.preventDefault();

    axios.delete(api_url + "projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id: input.id },
    });
    setShow(false);
    setIsToggled(false);
    setCheck(check - 1);
    setInput({
      title: "",
      description: "",
      startdate: new Date(),
      enddate: new Date(),
    });
  }

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>프로젝트</Card.Title>
        {projectsList}
        {isToggled && (
          <Form onSubmit={add}>
            <Form.Group controlId="formBasicTitle">
              <Form.Control
                type="text"
                name="title"
                placeholder="프로젝트 제목"
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
            <Form.Row>
              <Col xs="auto">
                <DatePicker
                  selected={input.startdate}
                  onChange={(date) => inputData("startdate", date)}
                />
              </Col>
              <Col xs="auto">
                <DatePicker
                  selected={input.enddate}
                  onChange={(date) => inputData("enddate", date)}
                />
              </Col>
            </Form.Row>
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
                  setInput({
                    title: "",
                    description: "",
                    startdate: new Date(),
                    enddate: new Date(),
                  });
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
              setInput({
                title: "",
                description: "",
                startdate: new Date(),
                enddate: new Date(),
              });
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
