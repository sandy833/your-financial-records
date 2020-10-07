// return user data from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem("i");
  if (userStr) {
    return JSON.parse(userStr);
  } else {
    return null;
  }
};

// return the token from localStorage
export const getToken = () => {
  return JSON.parse(localStorage.getItem("b")) || null;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
  localStorage.removeItem("b");
  localStorage.removeItem("i");
};

// set the token and user from the session storage
export const setUserSession = (token, user) => {
  sessionStorage.setItem("b", JSON.stringify(token));
  sessionStorage.setItem("i", JSON.stringify(user));
};
