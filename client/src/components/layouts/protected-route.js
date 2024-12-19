import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../layouts/authcontent.js";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();



  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

 
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;
