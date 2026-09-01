import type { AuthAction, AuthState } from "../../types";
import { LOGIN_SUCCESS, LOGOUT } from "../actions/authActions";

const initialState: AuthState = {
  token: null,
  user: null,
};

const authReducer = (authState = initialState, authAction: AuthAction) => {
  switch (authAction.type) {
    case LOGIN_SUCCESS: {
      const payload = authAction.payload;
      if (!payload) return authState;
      return {
        token: payload.token,
        user: payload.user,
      };
    }

    case LOGOUT:
      return initialState;

    default:
      return authState;
  }
};

export default authReducer;
