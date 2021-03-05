import React from "react";
import { useHistory } from "react-router-dom";
import { Nav, Col } from "react-bootstrap/";

export default function Navbar() {
  const token = localStorage.getItem("token");
  let history = useHistory();

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    history.push("/");
    window.location.reload();
  }

  return (
    <>
      <Nav className="justify-content-end">
        <Col>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              RacerIn
            </Nav.Link>
          </Nav.Item>
        </Col>
        {token && token !== "undefined" ? (
          <>
            <Nav.Item>
              <Nav.Link onClick={() => history.push("/main")}>메인</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => history.push("/network")}>
                네트워크
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={logout}>로그아웃</Nav.Link>
            </Nav.Item>
          </>
        ) : (
          <>
            <Nav.Item>
              <Nav.Link onClick={() => history.push("/")}>메인</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="disabled">네트워크</Nav.Link>
            </Nav.Item>
          </>
        )}
      </Nav>
    </>
  );
}
