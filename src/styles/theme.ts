import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#03C26C",
      dark: "#029B56",
      light: "#35CE89",
    },
    secondary: {
      main: "#4ACE03",
      dark: "#3BA502",
      light: "#6ED835",
    },
    label: {
      normal: "#1E2026",
      strong: "#0A0A0D",
      neutral: "#292B33",
      alternative: "#73757F",
      assistive: "#A4A7B2",
      disable: "#D8DAE5",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F7F8FA",
    },
    interaction: {
      inactive: "#A4A7B2",
      disable: "#F7F8FA",
    },
    line: {
      normal: "#D8DAE5",
      neutral: "#E9EAF2",
    },
    status: {
      positive: "#03C26C",
      negative: "#E65845",
    },
    static: {
      white: "#FFFFFF",
      black: "#000000",
    },
    fill: {
      normal: "#ECEFF5",
      strong: "#D8DAE5",
    },
    error: {
      main: "#E65845",
    },
    success: {
      main: "#03C26C",
    },
    text: {
      primary: "#1E2026",
      secondary: "#73757F",
      disabled: "#D8DAE5",
    },
    divider: "#D8DAE5",
  },
  typography: {
    fontFamily: "Pretendard Variable, sans-serif",
    // Display
    h1: {
      fontSize: "36px",
      lineHeight: "52px",
      letterSpacing: "-0.028em",
      fontWeight: 700,
    },
    // Title
    h2: {
      fontSize: "28px",
      lineHeight: "42px",
      letterSpacing: "-0.026em",
      fontWeight: 700,
    },
    // Heading 1
    h3: {
      fontSize: "24px",
      lineHeight: "36px",
      letterSpacing: "-0.022em",
      fontWeight: 600,
    },
    // Heading 2
    h4: {
      fontSize: "20px",
      lineHeight: "30px",
      letterSpacing: "-0.021em",
      fontWeight: 600,
    },
    // Headline
    h5: {
      fontSize: "18px",
      lineHeight: "29px",
      letterSpacing: "-0.021em",
      fontWeight: 600,
    },
    // Body
    body1: {
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "-0.021em",
      fontWeight: 400,
    },
    body2: {
      fontSize: "16px",
      lineHeight: "27px",
      letterSpacing: "-0.021em",
      fontWeight: 400,
    },
    // Label
    caption: {
      fontSize: "13px",
      lineHeight: "22px",
      letterSpacing: "-0.02em",
      fontWeight: 400,
    },
    // Caption
    overline: {
      fontSize: "11px",
      lineHeight: "20px",
      letterSpacing: "-0.02em",
      fontWeight: 400,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1200,
      lg: 1440,
      xl: 1920,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
