import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const logger = (store) => {
  return (next) => {
    return (action) => {
      console.group(action.type);
      console.log("[Middleware] Dispatching", action);
      const result = next(action);
      console.log("[Middleware] next state", store.getState());
      console.groupEnd();
      return result;
    };
  };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,

  //Development use
  composeEnhancers(applyMiddleware(logger, thunk))

  //Production use
  //compose(applyMiddleware(thunk))
);

export default store;
