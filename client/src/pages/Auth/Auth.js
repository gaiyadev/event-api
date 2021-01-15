import React, { Component } from "react";
import "../../pages/Auth/Auth.css";
import AuthContext from "../../context/auth-context";

export default class Auth extends Component {
  state = {
    isLogin: true,
  };
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  static contextType = AuthContext;

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const headers = {
      "Content-Type": "application/json",
    };

    let requestBody = {
      query: `
      query{
        login(email: "${email}", password: "${password}") {
          userId
          email
          token
          tokenExpired
        }
      }       
      `,
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
        mutation{
          createUser(userInput: {
            email: "${email}"
            password: "${password}"
          }) {
            _id
            email
          }
        }       
        `,
      };
    }

    fetch("graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: headers,
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);

        if (result.data.login.token) {
          this.context.login(
            result.data.login.token,
            result.data.login.userId,
            result.data.login.tokenExpired
          );
        }
      })
      .catch((err) => console.log(err));
  };

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  render() {
    return (
      <form onSubmit={this.submitHandler} className="auth-form">
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input
            ref={this.emailEl}
            type="text"
            id="email"
            placeholder="E-mail"
          />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            ref={this.passwordEl}
            id="password"
            placeholder="E-Password"
          />
        </div>

        <div className="form-action">
          <button type="suibmit">Submit</button>
          <button type="suibmit" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? "Singup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}
