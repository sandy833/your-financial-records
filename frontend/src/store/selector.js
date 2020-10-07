import _ from "lodash";

export const createLoadingSelector = (actions) => (state) => {
  // returns true only when all actions is not loading
  const loading = _(actions).some((action) =>
    _.get(state, `loading.${action}`)
  );

  return loading;
};

export const createErrorMessageSelector = (actions) => (state) => {
  // returns the first error messages for actions
  // We assume when any request fails on a page that requires multiple API calls, we shows the first error
  const error =
    _(actions)
      .map((action) => _.get(state, `error.${action}`))
      .compact()
      .first() || "";

  return error;
};
