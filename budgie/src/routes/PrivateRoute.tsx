import { Navigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // 1) accessToken 있으면 바로 통과
    if (token) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    // 2) accessToken 없으면 refreshToken으로 갱신 시도
    axios
      .post("/auth/refresh", {}, { withCredentials: true })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        setAuthorized(true);
      })
      .catch(() => {
        setAuthorized(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/" replace />;

  return children;
}
