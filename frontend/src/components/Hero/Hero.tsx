import React from "react";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  hero: {
    position: 'relative',
    width: '100%',
    height: '100vh',
  },
  hero__image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  },
  hero__title: {
    position: 'absolute',
    top: '5%',
    right: '10%',
    color: 'white',
    fontSize: '4rem',
    padding: '15px',
  },
}));

const Hero = ({ imageSrc }: {imageSrc: string}) => {
  const classes = useStyles();
  return (
    <div className={classes.hero}>
      <img src={imageSrc} alt="Travel" className={classes.hero__image} />
      <h1 className={classes.hero__title}>Pledge. Measure. Solve.</h1>
    </div>
  );
};

export default Hero;