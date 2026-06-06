import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface OAuthCallbackPageProps {
  type: "new" | "existing";
}

const OAuthCallbackPage = ({ type }: OAuthCallbackPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      navigate("/login", { replace: true });
      return;
    }

    setTokens({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "bearer",
    });

    if (type === "new") {
      navigate("/onboarding", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  }, []);

  return null;
};

export default OAuthCallbackPage;
