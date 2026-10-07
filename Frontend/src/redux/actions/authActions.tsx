import type { AuthState } from "../../types";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const USER_UPDATED = "USER_UPDATED";
export const LOGOUT = "LOGOUT";

export const loginSuccessAction = (token: string, user: AuthState["user"]) => {
  return {
    type: LOGIN_SUCCESS,
    payload: { token, user },
  };
};

// aggiorna i dati dell'utente loggato senza toccare il token
export const userUpdatedAction = (user: AuthState["user"]) => {
  return {
    type: USER_UPDATED,
    payload: user,
  };
};

export const logoutAction = () => {
  return { type: LOGOUT };
};
