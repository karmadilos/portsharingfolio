import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Navbar from "../auth/Navbar";
import {
  Button,
  Card,
  Container,
  Col,
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

  useEffect(() => {
    axios.get(api_url + "network", options).then((response) => {
      setOutput(response.data.user);
    });
  }, []);

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

  return (
    <div className="root">
      <Navbar />
      <Container fluid>
        <Row>
          <Col>
            <CardColumns>{userList}</CardColumns>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
