import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface OAuthCallbackPageProps {
  type: "new" | "existing";
}

const OAuthCallbackPage = ({ type }: OAuthCallbackPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "new") {
      navigate("/onboarding", { replace: true });
    } else {
      navigate("/home", { replace: true });
    }
  }, []);

  return null;
};

export default OAuthCallbackPage;
