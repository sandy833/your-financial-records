import React, { Fragment, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import PrivateRoute from "./utils/privateRoute";
import PublicRoute from "./utils/publicRoute";

import Home from "./views/home";
import Login from "./views/login";
import Dashboard from "./views/dashboard";

import { connect } from "react-redux";
import { getAuth } from "./store/actions";
import { getToken } from "./utils/globals";

const App = (props) => {
  const { getAuth } = props;

  useEffect(() => {
    const token = getToken();

    if (token) {
      getAuth();
    }
  }, [getAuth]);

  return (
    <Fragment>
      <Switch>
        <Route exact path="/" component={Home} />

        <PublicRoute path="/login" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Switch>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAuth: () => dispatch(getAuth()),
  };
};

export default connect(null, mapDispatchToProps)(App);
