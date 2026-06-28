import { Typography } from "@mui/material";

interface PersonalMessageProps {
  message: string;
}

const PersonalMessage = ({ message }: PersonalMessageProps) => {
  return (
    <Typography
      sx={{
        color: "#000000",
        fontFamily: "Pretendard Variable, sans-serif",
        fontSize: { xs: "20px", sm: "28px" },
        fontWeight: 600,
        lineHeight: { xs: "30px", sm: "42px" },
        letterSpacing: { xs: "-0.42px", sm: "-0.784px" },
        textAlign: "center",
      }}
    >
      {message}
    </Typography>
  );
};

export default PersonalMessage;
