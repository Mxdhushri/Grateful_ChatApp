export const HOST= import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES="api/auth"; // using the created api in index.js
export const SIGNUP_ROUTE =`${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;