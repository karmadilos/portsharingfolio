import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Main() {
  const api_url = "http://localhost:5000/";
  const token = localStorage.getItem("token");
  axios.get(api_url + "protected", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (
    <>
      <h1>hi</h1>
    </>
  );
}
