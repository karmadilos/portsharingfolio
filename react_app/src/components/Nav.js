import React from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <>
      <div>
        RacerIn
        <Link to="/main">메인</Link>
        <Link to="/register">네트워크</Link>
        <Link to="/logout">로그아웃</Link>
      </div>
    </>
  );
}
