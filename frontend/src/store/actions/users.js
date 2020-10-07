import axios from "axios";
import * as actionTypes from "./actionTypes";
import { getToken, removeUserSession } from "../../utils/globals";

const dataToken = getToken();

export const registerUser = (data, token = "") => {
  const request = axios.post(
    `${process.env.REACT_APP_ENDPOINT_MAIN}/users/register`,
    data,
    {
      headers: {
        Authorization: dataToken ? dataToken : token,
      },
    }
  );

  return (dispatch) => {
    request
      .then((response) => {
        return dispatch({
          type: actionTypes.REGISTER,
          payload: response.data.data,
        });
      })
      .catch((err) => {
        console.log(err.response);
        return dispatch({
          type: actionTypes.REGISTER_ERR,
          isError: true,
        });
      });
  };
};

export const loginWithExternalData = (data, token = "") => {
  const request = axios.post(
    `${process.env.REACT_APP_ENDPOINT_MAIN}/users/registerauth`,
    data,
    {
      headers: {
        Authorization: dataToken ? dataToken : token,
      },
    }
  );

  return (dispatch) => {
    request
      .then((response) => {
        return dispatch(
          {
            type: actionTypes.REGISTER_EXT,
            payload: response.data.data,
            isLogin: true,
            isError: false,
          },

          window.localStorage.setItem(
            "b",
            JSON.stringify(response.data.data.token)
          )
        );
      })
      .catch((err) => {
        console.log(err.response);
        return dispatch({
          type: actionTypes.REGISTER_EXT_ERR,
          isError: true,
        });
      });
  };
};

export const loginUser = (data) => {
  const request = axios.post(
    `${process.env.REACT_APP_ENDPOINT_MAIN}/users/login`,
    data
  );

  return (dispatch) => {
    dispatch({ type: actionTypes.LOGIN_REQUEST });

    request
      .then((response) => {
        return dispatch(
          {
            type: actionTypes.LOGIN_SUCCESS,
            payload: response.data.data,
          },

          window.localStorage.setItem(
            "b",
            JSON.stringify(response.data.data.token)
          )
        );
      })
      .catch((err) => {
        console.log(err.response);
        return dispatch({
          type: actionTypes.LOGIN_FAILURE,
          payload: err.response.data.status,
        });
      });
  };
};

export const logoutUser = (token = "") => {
  const request = axios.get(
    `${process.env.REACT_APP_ENDPOINT_MAIN}/users/logout`,
    {
      headers: {
        Authorization: dataToken ? dataToken : token,
      },
    }
  );

  return (dispatch) => {
    request
      .then((response) => {
        return dispatch(
          {
            type: actionTypes.LOGOUT,
            payload: response,
            isLogin: false,
          },

          window.localStorage.clear()
        );
      })
      .catch((err) => {
        console.log(err.response);
        return;
      });
  };
};

export const getAuth = (token = "") => {
  const request = axios.get(
    `${process.env.REACT_APP_ENDPOINT_MAIN}/users/auth`,
    {
      headers: {
        Authorization: dataToken ? dataToken : token,
      },
    }
  );

  return (dispatch) => {
    dispatch({ type: actionTypes.AUTH_REQUEST });

    request
      .then((response) => {
        return dispatch({
          type: actionTypes.AUTH_SUCCESS,
          payload: response.data.data,
        });
      })
      .catch((err) => {
        console.log(err.response);
        return dispatch(
          {
            type: actionTypes.AUTH_FAILURE,
            payload: err.response.data.status,
          },

          removeUserSession()
        );
      });
  };
};
