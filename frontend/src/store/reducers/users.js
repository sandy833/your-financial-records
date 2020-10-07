import * as actionTypes from "../actions/actionTypes";

const initialState = {
  isLogin: false,
  user: {},
};

const usrReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLogin: true,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: initialState.user,
        isLogin: false,
      };
    default:
      return state;
  }
};

export default usrReducer;
