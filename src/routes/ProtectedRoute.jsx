import React from "react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useUserActions } from "../hooks/user.actions";

import { getUser } from "../hooks/user.actions";

function ProtectedRoute({ children }) {
    
    /*
    //definisanje userActions
    const [error, setError] = useState(null);
    const userActions = useUserActions();
  
    // pozivanje usera
    const user = userActions.fetchUser().catch((err) => {
      if (err.message) {
        setError(err.request.response);
      }
    });
    */

  const user = getUser();
  return user ? <>{children}</> : <Navigate to="/login/" />;
  
}

export default ProtectedRoute;