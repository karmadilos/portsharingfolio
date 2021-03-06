import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Navbar from "../auth/Navbar";
import {
  Button,
  Card,
  Container,
  Col,
  Image,
  Modal,
  Row,
  Form,
  CardColumns,
} from "react-bootstrap/";

export default function Network() {
  const api_url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const history = useHistory();
  const [output, setOutput] = useState([]);
  const [searchname, setSearchname] = useState("");
  const [isSearching, setIsSearching] = useState("");
  const [searchoutput, setSearchOutput] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let width = window.innerWidth;

  useEffect(() => {
    axios.get(api_url + "network", options).then((response) => {
      setOutput(response.data.user);
    });
    setIsSearching(false);
  }, []);

  useEffect(() => {
    if (!token || token === "undefined") {
      history.replace("/");
    }

    if (!isSearching) {
      return;
    }

    const data = { searchname: searchname };
    axios.post(api_url + "network", data, options).then((response) => {
      setSearchOutput(response.data.user);
    });
  }, [isSearching]);

  function search(e) {
    e.preventDefault();
    if (searchname.length < 2) {
      setShow(true);
      return;
    }
    setIsSearching(true);
  }

  const userList = output.map((user, index) => (
    <Card className="mb-2" key={index}>
      <Card.Body>
        <Row className="justify-content-md-center">
          <img
            width="64"
            height="64"
            className="mb-3"
            src={user.image_path}
            alt="profile"
          />
        </Row>
        <Card.Title>{user.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
        <Card.Text>{user.info}</Card.Text>
        <Card.Link onClick={() => history.push(`/main/${user.id}`)}>
          Show user
        </Card.Link>
      </Card.Body>
    </Card>
  ));

  const searchuserList = searchoutput.map((user, index) => (
    <Card className="mb-2" key={index}>
      <Card.Body>
        <Row className="justify-content-md-center">
          <img
            width="64"
            height="64"
            className="mb-3"
            src={user.image_path}
            alt="profile"
          />
        </Row>
        <Card.Title>{user.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{user.email}</Card.Subtitle>
        <Card.Text>{user.info}</Card.Text>
        <Card.Link onClick={() => history.push(`/main/${user.id}`)}>
          Show user
        </Card.Link>
      </Card.Body>
    </Card>
  ));

  return (
    <div className="root">
      <Navbar />
      <Container fluid>
        <Form onSubmit={search}>
          <Form.Row>
            <Col>
              <Form.Group controlId="formBasicSearch">
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    setSearchname(e.target.value);
                    setIsSearching(false);
                    setSearchOutput([]);
                  }}
                />
              </Form.Group>
            </Col>
            <Col xs="auto">
              <Button type="submit">검색</Button>
            </Col>
          </Form.Row>
        </Form>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>에러!</Modal.Title>
          </Modal.Header>
          <Modal.Body>검색어는 최소 2글자 이상 입력해야 합니다.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
        <Row>
          <Col>
            <CardColumns>
              {!isSearching && userList}
              {isSearching &&
                (searchoutput.length !== 0 ? (
                  searchuserList
                ) : (
                  <Image
                    src="/user_not_found.png"
                    width={width}
                    height="100%"
                  ></Image>
                ))}
            </CardColumns>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
