import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/authStore";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    let user = useRecoilValue(userState);
    let location = useLocation();

    useEffect(() => {
      
    })
  
    if (!user) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
  
    return children;
  }