import React, { useState } from "react";
export default function Register() {
  return (
    <article>
      <form action="register" method="post">
        <div>
          <label>Email address</label>
          <input type="email" name="email" placeholder="Enter email" />
          <p>Check your email.</p>
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" placeholder="Password" />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="password_confirm"
            placeholder="Password"
          />
          <p>Check your password.</p>
        </div>
        <div>
          <label>Name</label>
          <input type="text" name="name" placeholder="Name" />
        </div>
        <div>
          <button type="submit">회원가입</button>
        </div>
      </form>
    </article>
  );
}
