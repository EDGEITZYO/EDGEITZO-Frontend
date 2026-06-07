import { Typography } from "@mui/material";

interface PersonalMessageProps {
  message: string;
}

const PersonalMessage = ({ message }: PersonalMessageProps) => {
  return (
    <Typography
      sx={{
        fontSize: "56px",
        fontWeight: 700,
        lineHeight: "72px",
        letterSpacing: "-1.12px",
        color: "label.strong",
        textAlign: "center",
      }}
    >
      {message}
    </Typography>
  );
};

export default PersonalMessage;
