import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import SignupVerifyForm from "../components/signup/SignupVerifyForm";

const SignupVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email?: string; password?: string; name?: string } | null;

  if (!state?.email) {
    navigate("/signup", { replace: true });
    return null;
  }

  return (
    <AuthLayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: "189px",
          "@media (min-width: 600px) and (max-width: 1199px)": {
            py: "208px",
          },
          "@media (max-width: 599px)": {
            py: 0,
            alignItems: "stretch",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "940px",
            justifyContent: "flex-end",
            "@media (min-width: 600px) and (max-width: 1199px)": {
              width: "480px",
              justifyContent: "center",
            },
            "@media (max-width: 599px)": {
              width: "100%",
              maxWidth: "599px",
            },
          }}
        >
          <SignupVerifyForm email={state.email} state={{ email: state.email, password: state.password ?? "", name: state.name ?? "" }} />
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignupVerifyPage;
