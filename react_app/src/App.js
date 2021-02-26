import React from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Main from "./components/Main";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/main" component={Main} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
