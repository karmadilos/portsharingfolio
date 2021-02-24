import React from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import { Route, HashRouter } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <div>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </div>
    </HashRouter>
  );
}

export default App;
