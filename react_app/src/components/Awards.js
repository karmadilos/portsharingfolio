import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Container, Col, Row, Form } from "react-bootstrap/";

export default function Awards() {
  return (
    <></>
    // <Card className="mb-2">
    //   {isToggled ? (
    //     <Card.Body>
    //       <Form onSubmit={edit}>
    //         <Form.Group controlId="formBasicImage">
    //           <Form.File
    //             id="custom-file-translate-scss"
    //             label="Select file"
    //             accept="image/jpeg, image/jpg, image/PNG, image/GIF, image/TIF"
    //             lang="en"
    //             custom
    //             onChange={(e) => setPath(e.target.files[0])}
    //           />
    //         </Form.Group>
    //         <Form.Group controlId="formBasicName">
    //           <Form.Control
    //             type="text"
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //           />
    //         </Form.Group>
    //         <Form.Group controlId="formBasicEmail">
    //           <Form.Control
    //             type="email"
    //             value={email}
    //             // onChange={(e) => setEmail(e.target.value)}
    //           />
    //         </Form.Group>
    //         <Form.Group controlId="formBasicDescription">
    //           <Form.Control
    //             type="text"
    //             value={info}
    //             onChange={(e) => setInfo(e.target.value)}
    //           />
    //         </Form.Group>
    //         <Form.Row className="justify-content-md-center">
    //           <Button className="mr-2" type="submit" variant="primary">
    //             확인
    //           </Button>
    //           <Button
    //             type="button"
    //             variant="secondary"
    //             onClick={() => setIsToggled(!isToggled)}
    //           >
    //             취소
    //           </Button>
    //         </Form.Row>
    //       </Form>
    //     </Card.Body>
    //   ) : (
    //     <Card.Body>
    //       <Row className="justify-content-md-center">
    //         <img
    //           width="64"
    //           height="64"
    //           className="mb-3"
    //           src={path}
    //           alt="Generic placeholder"
    //         />
    //       </Row>
    //       <Card.Title>{name}</Card.Title>
    //       <Card.Subtitle className="mb-2 text-muted">{email}</Card.Subtitle>
    //       <Card.Text>{info}</Card.Text>
    //       <Row className="justify-content-md-center">
    //         <Button
    //           type="button"
    //           variant="link"
    //           className="btn-sm"
    //           onClick={() => setIsToggled(!isToggled)}
    //         >
    //           Edit
    //         </Button>
    //       </Row>
    //     </Card.Body>
    //   )}
    // </Card>
  );
}
