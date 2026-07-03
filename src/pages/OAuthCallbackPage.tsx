import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";

interface OAuthCallbackPageProps {
  type: "new" | "existing";
}

const OAuthCallbackPage = ({ type }: OAuthCallbackPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "new") {
      authApi
        .getMe()
        .then(({ data }) => {
          navigate("/signup/complete", {
            replace: true,
            state: { type: "social", name: data },
          });
        })
        .catch(() => {
          navigate("/signup/complete", {
            replace: true,
            state: { type: "social", name: "" },
          });
        });
    } else {
      navigate("/home", { replace: true });
    }
  }, []);

  return null;
};

export default OAuthCallbackPage;
