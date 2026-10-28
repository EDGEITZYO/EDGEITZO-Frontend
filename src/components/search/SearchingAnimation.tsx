import { Lottie } from "lottie-react";
import searchingJson from "../../assets/animations/searching.json";

const SearchingAnimation = () => (
  <Lottie
    src={searchingJson}
    loop
    autoplay
    style={{ width: "36px", height: "36px", flexShrink: 0 }}
  />
);

export default SearchingAnimation;
