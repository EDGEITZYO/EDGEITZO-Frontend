import '@mui/material/styles';

declare module '@mui/material/styles' {
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
}