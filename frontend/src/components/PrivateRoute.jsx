import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("userID");

  return token && userID ? children : <Navigate to="/login" />;
}