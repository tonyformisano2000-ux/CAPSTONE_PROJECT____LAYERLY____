import type { AuthState } from "../../types";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";

export const loginSuccessAction = (token: string, user: AuthState["user"]) => {
  return {
    type: LOGIN_SUCCESS,
    payload: { token, user },
  };
};

export const logoutAction = () => {
  return { type: LOGOUT };
};
