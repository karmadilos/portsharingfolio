import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Modal, Row, Form } from "react-bootstrap/";

export default function Awards({ isEdittable, user_id }) {
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
  });
  const [output, setOutput] = useState([]);
  const [status, setStatus] = useState([]);
  const [check, setCheck] = useState(0);
  const [option, setOption] = useState("");

  const [isToggled, setIsToggled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user_id === undefined) {
      axios.get(api_url + "awards", options).then((response) => {
        setOutput(response.data.result);
      });
    } else {
      axios.get(api_url + `awards/${user_id}`, options).then((response) => {
        setOutput(response.data.result);
      });
    }
  }, [check, user_id]);

  const awardsList = output.map((award, index) => (
    <Card.Text key={index}>
      <Row className="justify-content-between align-items-center row">
        <Col>
          {award["title"]}
          <br />
          <span className="text-muted">{award["description"]}</span>
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
                id: award["id"],
                title: award["title"],
                description: award["description"],
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
    };

    if (option === "add") {
      axios.post(api_url + "awards", data, options).then((response) => {
        setStatus(response.data);
      });
    } else if (option === "edit") {
      axios.patch(api_url + "awards", data, options).then((response) => {
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
      setInput({ title: "", description: "" });
    }
  }, [status]);

  function clear(e) {
    e.preventDefault();

    axios.delete(api_url + "awards", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id: input.id },
    });
    setShow(false);
    setIsToggled(false);
    setCheck(check - 1);
    setInput({ title: "", description: "" });
  }

  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>????????????</Card.Title>
        {awardsList}
        {isToggled && (
          <Form onSubmit={add}>
            <Form.Group controlId="formBasicTitle">
              <Form.Control
                type="text"
                name="title"
                placeholder="????????????"
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
                  setInput({ title: "", description: "" });
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
                setInput({ title: "", description: "" });
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
