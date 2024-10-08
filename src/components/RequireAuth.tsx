import { useRecoilValueLoadable } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  let user = useRecoilValueLoadable(userAtom);
  let location = useLocation();

  if(user.state == 'loading') {
    return <div className="font-bold">Loading...</div>
  }

  if (!user.contents) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}