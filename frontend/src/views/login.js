import React, { useState, useEffect, Fragment } from "react";
import { withRouter, useHistory } from "react-router-dom";

import DocumentMeta from "react-document-meta";
import Layout from "../templates";

import { connect } from "react-redux";
import {
  //loginWithExternalData,
  loginUser,
} from "../store/actions";
import {
  createLoadingSelector,
  createErrorMessageSelector,
} from "../store/selector";

const Login = (props) => {
  const {
    //loginWithExternalData,
    loginUser,
    isLogin,
    isLoading,
    isError,
  } = props;
  const [data, setData] = useState("");

  const history = useHistory();

  useEffect(() => {
    if (isLogin) {
      history.push("/dashboard");
    }
  }, [isLogin, history]);

  const handleLogin = () => {
    loginUser(data);
  };

  const handleForm = (e, formName) => {
    setData({ ...data, [formName]: e.target.value });
  };

  const meta = {
    title: `${process.env.REACT_APP_BRAND} - Your Web Solution`,
    description: `${process.env.REACT_APP_BRAND} is the solution for all your needs`,
    meta: {
      name: {
        robots: "follow,index",
        keywords: "simple, fast, reliable",
      },
    },
  };

  return (
    <DocumentMeta {...meta}>
      <Layout>
        <div className="content">
          <h4>Login</h4>
          <div>
            <label>Username: </label>
            <input
              type="text"
              onChange={(e) => handleForm(e, "username")}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <label>Password: </label>
            <input
              type="password"
              onChange={(e) => handleForm(e, "password")}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>
          {isError && isError.code === 401 && (
            <Fragment>
              <small style={{ color: "red" }}>{isError.message}</small>
            </Fragment>
          )}
          <div style={{ marginTop: 10, marginBottom: 20 }}>
            <input
              type="button"
              value={isLoading ? "Loading..." : "Login"}
              onClick={handleLogin}
              disabled={isLoading}
            />
          </div>
          <div className="google-btn">
          <a href="/auth/google">
          </a>
          </div>
        </div>
      </Layout>
    </DocumentMeta>
  );
};

const loadingSelector = createLoadingSelector(["LOGIN"]);
const errorSelector = createErrorMessageSelector(["LOGIN"]);

const mapStateToProps = (state) => {
  return {
    isLogin: state.usrReducer.isLogin,
    isLoading: loadingSelector(state),
    isError: errorSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //loginWithExternalData: (data, token) => dispatch(loginWithExternalData(data, token)),
    loginUser: (data) => dispatch(loginUser(data)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
