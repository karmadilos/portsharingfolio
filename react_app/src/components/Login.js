import React, { useState } from "react";
import Register from "./Register";

export default function Login() {
  return (
    <article>
      <form action="login" method="post">
        <div>
          <label>Email address</label>
          <input type="email" name="email" placeholder="Enter email" />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" placeholder="Password" />
        </div>
        <div>
          <button type="submit">로그인</button>
          <button type="button">회원가입하기</button>
        </div>
      </form>
    </article>
  );
}
