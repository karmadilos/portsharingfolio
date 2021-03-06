import React from "react";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Main from "./components/user/Main";
import Network from "./components/others/Network";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
  });
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route exact path="/main" component={Main} />
          <Route path="/main/:user_id" component={Main} />
          <Route path="/network" component={Network} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
