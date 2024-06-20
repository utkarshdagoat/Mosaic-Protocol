const api = import.meta.env.VITE_BACKEND_URL as string;

export const SIGNUP_API = api + "/signup";
export const LOGIN_API = api + "/login";
export const LOGOUT_API = api + "/logout";
