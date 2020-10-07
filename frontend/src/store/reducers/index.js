import { combineReducers } from "redux";

import usrReducer from "./users";
import loading from "./loading";
import error from "./error";

const rootReducer = combineReducers({
  usrReducer,
  loading,
  error,
});

export default rootReducer;
