import { Box } from "@mui/material";
import SignupForm from "../components/signup/SignupForm";

const SignupPage = () => {
  return (
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
        <SignupForm />
      </Box>
    </Box>
  );
};

export default SignupPage;
