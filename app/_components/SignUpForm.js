"use client";

import { dbSignUp } from "../_library/serverActions";
import SubmitButton from "./SubmitButton";

function SignUpForm() {
  return (
    <form action={dbSignUp}>
      <div className="grid-flow-row">
        <div className="form-row">
          <label htmlFor="firstName">First Name:&nbsp;</label>
          <input
            name="firstName"
            type="text"
            className="rounded-md"
            placeholder="First name"
          />
        </div>
        <div className="form-row">
          <label htmlFor="lastName">Last Name:&nbsp;</label>
          <input
            name="lastName"
            type="text"
            className="rounded-md"
            placeholder="Last name"
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email:&nbsp;</label>
          <input
            name="email"
            type="email"
            className="rounded-md"
            placeholder="Email"
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password:&nbsp;</label>
          <input name="password" type="password" className="rounded-md" />
        </div>
        <div className="form-row">
          <label htmlFor="confirm">Confirm Password:&nbsp;</label>
          <input name="confirm" type="password" className="rounded-md" />
        </div>
        <div className="">
          <SubmitButton cssClasses="rounded-md bg-yellow-600 font-bold p-2 w-1/2 hover:bg-accent-600 active:bg-yellow-500">
            Sign Up
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default SignUpForm;
