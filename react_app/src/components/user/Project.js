import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Modal, Row, Form } from "react-bootstrap/";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export default function Project({ isEdittable, user_id }) {
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
  const [status, setStatus] = useState([]);
  const [check, setCheck] = useState(0);
  const [option, setOption] = useState("");

  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user_id === undefined) {
      axios.get(api_url + "projects", options).then((response) => {
        setOutput(response.data.result);
      });
    } else {
      axios.get(api_url + `projects/${user_id}`, options).then((response) => {
        setOutput(response.data.result);
      });
    }
  }, [check, user_id]);

  const projectsList = output.map((project, index) => (
    <Card.Text key={index}>
      <Row className="justify-content-between align-items-center row">
        <Col>
          {project["title"]}
          <br />
          <span className="text-muted">{project["description"]}</span>
          <br />
          <span className="text-muted">
            {moment(project["startdate"]).format("yyyy-MM-DD")} ~{" "}
            {moment(project["enddate"]).format("yyyy-MM-DD")}
          </span>
        </Col>
        {isEdittable && (
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
                startdate: new Date(project["startdate"]),
                enddate: new Date(project["enddate"]),
              });
            }}
          >
            Edit
          </Button>
        )}
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
      startdate: moment(input.startdate).format("yyyy-MM-DD"),
      enddate: moment(input.enddate).format("yyyy-MM-DD"),
    };

    if (option === "add") {
      axios.post(api_url + "projects", data, options).then((response) => {
        setStatus(response.data);
      });
    } else if (option === "edit") {
      axios.patch(api_url + "projects", data, options).then((response) => {
        setStatus(response.data);
      });
    }
  }

  useEffect(() => {
    if (!status) {
      return;
    }
    if (status.status === "success") {
      setIsToggled(false);
      setCheck(check + 1);
      setInput({
        title: "",
        description: "",
        startdate: new Date(),
        enddate: new Date(),
      });
    }
  }, [status]);

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
        <Card.Title>????????????</Card.Title>
        {projectsList}
        {isToggled && (
          <Form onSubmit={add}>
            <Form.Group controlId="formBasicTitle">
              <Form.Control
                type="text"
                name="title"
                placeholder="???????????? ??????"
                value={input.title}
                onChange={(e) => inputData("title", e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicDescription">
              <Form.Control
                type="text"
                name="description"
                placeholder="????????????"
                value={input.description}
                onChange={(e) => inputData("description", e.target.value)}
              />
            </Form.Group>
            <Form.Row className="mb-3">
              <Col xs="auto">
                <DatePicker
                  closeOnScroll={true}
                  selected={input.startdate}
                  maxDate={input.enddate}
                  onChange={(date) => inputData("startdate", date)}
                />
              </Col>
              <Col xs="auto">
                <DatePicker
                  closeOnScroll={true}
                  selected={input.enddate}
                  minDate={input.startdate}
                  onChange={(date) => inputData("enddate", date)}
                />
              </Col>
            </Form.Row>
            {status.status === "fail" && (
              <Form.Text className="text-danger small mb-3">
                {status.result.message}
              </Form.Text>
            )}
            <Form.Row className="justify-content-md-center">
              <Button className="mr-2" type="submit">
                ??????
              </Button>
              {option === "edit" && (
                <Button
                  className="mr-2"
                  type="button"
                  variant="danger"
                  onClick={handleShow}
                >
                  ??????
                </Button>
              )}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>?????? ?????????????????????????</Modal.Title>
                </Modal.Header>
                <Modal.Body>??????????????? ????????? ??? ????????????!</Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={clear}>
                    ??????
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    ??????
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
                ??????
              </Button>
            </Form.Row>
          </Form>
        )}
        {isEdittable && (
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
        )}
      </Card.Body>
    </Card>
  );
}
