import React from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function Main() {
  const api_url = "http://localhost:5000/";
  const token = localStorage.getItem("token");
  axios
    .get(api_url + "protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then();
  return (
    <>
      <Navbar />
      <h1>hi</h1>
    </>
  );
}
