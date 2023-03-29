import React from "react";

import { Typography} from "@material-ui/core";


const Hero = ({ imageSrc }) => {
  return (
    <div className="hero">
      <img src={imageSrc} alt="Travel" className="hero__image" />
      <h1 className="hero__title">Pledge. Measure. Solve.</h1>
    </div>
  );
};

export default Hero;