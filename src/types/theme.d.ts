import "@mui/material/styles";
import "@mui/material/Typography";

declare module "@mui/material/styles" {
  interface Palette {
    label: {
      normal: string;
      strong: string;
      neutral: string;
      alternative: string;
      assistive: string;
      disable: string;
    };
    interaction: {
      inactive: string;
      disable: string;
    };
    line: {
      normal: string;
      neutral: string;
    };
    status: {
      positive: string;
      negative: string;
    };
    static: {
      white: string;
      black: string;
    };
    fill: {
      normal: string;
      strong: string;
    };
  }

  interface PaletteOptions {
    label?: {
      normal?: string;
      strong?: string;
      neutral?: string;
      alternative?: string;
      assistive?: string;
      disable?: string;
    };
    interaction?: {
      inactive?: string;
      disable?: string;
    };
    line?: {
      normal?: string;
      neutral?: string;
    };
    status?: {
      positive?: string;
      negative?: string;
    };
    static?: {
      white?: string;
      black?: string;
    };
    fill?: {
      normal?: string;
      strong?: string;
    };
  }

  interface TypographyVariants {
    // Display SB — 36px / 52px / -3% / 600
    displaySb: React.CSSProperties;
    // Title SB — 28px / 42px / -2.8% / 600
    titleSb: React.CSSProperties;
    // Heading 1 M — 24px / 36px / -2.4% / 500
    heading1M: React.CSSProperties;
    // Heading 2 M — 20px / 30px / -2.3% / 500
    heading2M: React.CSSProperties;
    // Headline M — 18px / 29px / -2.1% / 500
    headlineM: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    displaySb?: React.CSSProperties;
    titleSb?: React.CSSProperties;
    heading1M?: React.CSSProperties;
    heading2M?: React.CSSProperties;
    headlineM?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    displaySb: true;
    titleSb: true;
    heading1M: true;
    heading2M: true;
    headlineM: true;
  }
}
