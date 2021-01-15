import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Events from "./pages/Events/Events";
import Bookings from "./pages/Booking/Bookings";
import NavBar from "./Components/Navbar/NavBar";

import React, { Component } from "react";
import AuthContext from "./context/auth-context";

export default class App extends Component {
  state = {
    token: null,
    userId: null,
  };

  login = (token, userId, tokenExpired) => {
    this.setState({
      token: token,
      userId: userId,
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <NavBar />
          <main className="main-content">
            <Switch>
              {!this.state.token && <Redirect from="/" to="/auth" exact />}
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}
              {!this.state.token && (
                <Redirect from="/bookings" to="/auth" exact />
              )}

              <Route path="/" component={Auth} exact />
              {!this.state.token && (
                <Route path="/auth" component={Auth} exact />
              )}
              <Route path="/events" component={Events} exact />
              {this.state.token && (
                <Route path="/bookings" component={Bookings} exact />
              )}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}
