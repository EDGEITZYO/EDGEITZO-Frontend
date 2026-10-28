import { Lottie } from "lottie-react";
import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import searchingJson from "../../assets/animations/searching.json";

const containerSx: SxProps<Theme> = {
  width: "160px",
  height: "36px",
  overflow: "hidden",
  flexShrink: 0,
};

const SearchingAnimation = () => (
  <Box sx={containerSx}>
    <Lottie
      src={searchingJson}
      loop
      autoplay
      style={{ width: "645px", height: "36px" }}
      rendererSettings={{ preserveAspectRatio: "xMinYMid slice" }}
    />
  </Box>
);

export default SearchingAnimation;
