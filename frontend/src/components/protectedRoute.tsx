import { Navigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../context/provider";

interface Props {
  children: any
}

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
  } catch (err) {
    return true;
  }
};

export const ProtectedRoute = ({ children }: Props) => {
  const { state, dispatch } = useContext(UserContext);

  // Check context first
  let token = state?.user.token;

  // If context empty (page refresh), check localStorage
  if (!token) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      token = parsed.token;
    }
  }

  // No token
  if (!token) {
     dispatch({
      type: "Logout",
      payload: { id: "", email: "", username: "", token: "" },
    });
    return <Navigate to="/signin" replace />;
  }

  // Expired token
  if (isTokenExpired(token)) {
    localStorage.removeItem("user");
    return <Navigate to="/signin" replace />;
  }

  return children;
};