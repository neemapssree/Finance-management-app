import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export function UserAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    return(
        token ? <Outlet /> : <Navigate to="/login" />
    )
}

export function UserAuthSections({ authorized, children }) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (authorized) {
        return token ? children : null;   //shows content only form Authorized users
      } else {
        return children;
      }
  }

  export function NonUserAuthSections({ authorized, children }) {    //Content to show only for non-logged in users
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!authorized) {
        return token ? null : children;   //shows content only form Authorized users
      } else {
        return null;
      }
  }

// export function AdminAuth() {
//     const token = localStorage.getItem('token');
//     const user = localStorage.getItem('user');

//     return(
//         token && user.role === 1 ? <Outlet /> : <Navigate to ="/login" />
//     )
// }

export function LoginAuth(){
    const token = localStorage.getItem('token');    

    return(
        token ? <Navigate to="/" /> : <Outlet />
    )
}