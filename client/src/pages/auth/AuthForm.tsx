import React, { FormEvent, useState } from "react";
import NavBar from "../../components/general/NavBar";
import { login, createUser } from "../../actions/actions.js";
import { Button, TextField, FormControl, Typography } from "@material-ui/core";
import { Person, PersonAdd } from "@material-ui/icons";
import "./AuthForm.css";

interface Props {
  uid: string;
  showLogin: boolean;
}

export default function AuthForm(props: Props) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  return (
    <div id="authForm">
      <NavBar uid={props.uid} />
      <form
        className="container"
        onSubmit={
          props.showLogin
            ? (event) => handleLogin(event, username, pass)
            : (event) => handleSignup(event, username, pass, confPass)
        }
      >
        <Typography variant="h2">
          {props.showLogin ? <Person /> : <PersonAdd />}{" "}
          {props.showLogin ? "Log In" : "Sign Up"}
        </Typography>
        <FormControl className="input-field">
          <TextField
            label="Username"
            id="username-input"
            // @ts-ignore
            InputLabelProps={{ for: "username-input" }}
            onChange={(event) => setUsername(event.target.value)}
            inputProps={{ minLength: 5 }}
            required
          />
        </FormControl>
        <FormControl className="input-field">
          <TextField
            label="Password"
            id="pass-input"
            // @ts-ignore
            InputLabelProps={{ for: "pass-input" }}
            type="password"
            onChange={(event) => setPass(event.target.value)}
            inputProps={{ minLength: 8 }}
            required
          />
        </FormControl>
        {getConfPassField(props, setConfPass)}
        <FormControl className="input-field">
          <Button type="submit" variant="contained">
            {props.showLogin ? "Log In" : "Sign Up"}
          </Button>
        </FormControl>
      </form>
    </div>
  );
}

const getConfPassField = (props: Props, setConfPass: (s: string) => void) => {
  if (!props.showLogin) {
    return (
      <FormControl className="input-field">
        <TextField
          label="Confirm Password"
          type="password"
          onChange={(event) => setConfPass(event.target.value)}
          inputProps={{ minLength: 8 }}
          required
          id="confpass-input"
          // @ts-ignore
          InputLabelProps={{ for: "confpass-input" }}
        />
      </FormControl>
    );
  }
};

const handleLogin = async (
  event: FormEvent,
  username: string,
  pass: string
) => {
  event.preventDefault();
  const payload = {
    username: username,
    password: pass,
  };
  try {
    await login(payload);
    window.open("/calendar", "_self");
  } catch (error) {
    console.log(error);
  }
};

const handleSignup = async (
  event: FormEvent,
  username: string,
  pass: string,
  confPass: string
) => {
  event.preventDefault();
  if (pass !== confPass) {
    return;
  }
  const payload = {
    username: username,
    password: pass,
  };
  try {
    await createUser(payload);
    await login(payload);
    window.open("/calendar", "_self");
  } catch (error) {
    console.log(error);
  }
};
