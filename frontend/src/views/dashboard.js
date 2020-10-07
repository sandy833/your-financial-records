import React, { useEffect } from "react";
import { withRouter, useHistory } from "react-router-dom";

import DocumentMeta from "react-document-meta";
import Layout from "../templates";

import { connect } from "react-redux";
import { logoutUser } from "../store/actions";
import { createLoadingSelector } from "../store/selector";

function Dashboard(props) {
  const { logoutUser, user, isLogin, isLoading } = props;
  const history = useHistory();

  useEffect(() => {
    if (!isLogin) {
      history.push("/login");
    }
  }, [isLogin, history]);

  const handleLogout = () => {
    logoutUser(user.token);
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
          {isLoading ? "Loading..." : `Welcome ${user.user?.namer}!`}
          <br />
          <br />
          <button type="button" onClick={handleLogout}>
            {isLoading ? "Loading..." : "Logout"}
          </button>
        </div>
      </Layout>
    </DocumentMeta>
  );
}

const loadingSelector = createLoadingSelector(["AUTH"]);

const mapStateToProps = (state) => {
  return {
    user: state.usrReducer.user,
    isLogin: state.usrReducer.isLogin,
    isLoading: loadingSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: (token) => dispatch(logoutUser(token)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
