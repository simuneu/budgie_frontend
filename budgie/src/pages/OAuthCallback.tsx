import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/?error=oauth_failed");
      return;
    }

    // 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // 로그인 후 이동할 페이지
    navigate("/app/dashboard");
  }, []);

  return <div>로그인 처리 중...</div>;
}
