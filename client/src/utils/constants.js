export const HOST= import.meta.env.VITE_SERVER_URL;
//making of routes
export const AUTH_ROUTES="api/auth"; // using the created api in index.js
export const SIGNUP_ROUTE =`${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;// we declare here and define route in backend routes
export const ADD_PROFILE_IMAGE_ROUTE =`${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`; //same name in auth routes
export const LOGOUT_ROUTE =`${AUTH_ROUTES}/logout` // after controller->routes->constants
export const CONTACTS_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTES =`${CONTACTS_ROUTES}/search`;// comes from contactroutes, axios,integration
export const GET_DM_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;