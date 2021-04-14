import * as React from 'react';
import {
  withStyles,
  Theme,
  WithStyles,
  createStyles,
} from '@material-ui/core/styles';
import Button from '../../components/Button';
import Typography from '../../components/Typography';
import ProductHeroLayout from '../Product/ProductHeroLayout';

const backgroundImage =
  'https://images.wallpaperscraft.com/image/earth_planet_space_133110_1280x720.jpg';

const styles = (theme: Theme) =>
  createStyles({
    background: {
      backgroundImage: `url(${backgroundImage})`,
      backgroundColor: '#7fc7d9', // Average color of the background image.
      backgroundPosition: 'center',
    },
    button: {
      minWidth: 200,
    },
    h5: {
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(10),
      },
    },
    h2: {
      marginTop: theme.spacing(10),
    },
    more: {
      marginTop: theme.spacing(2),
    },
  });

function ProductHero(props: WithStyles<typeof styles>) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: 'none' }}
        src={backgroundImage}
        alt="increase priority"
      />
      <>
        <Typography color="inherit" align="center" variant="h2" marked="center" className={classes.h2}>
          Pledge. Measure. Solve.
      </Typography>
      </>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        Pledge4Future is a project to help you and your working group to measure and reduce your work-related CO<sub>2</sub>e-footprint.
        It helps you and everyone else to contribute protecting our climate and life on Earth.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        size="large"
        className={classes.button}
        component="a"
        href="/sign-up/"
      >
        Register
      </Button>
      <Typography variant="body2" color="inherit" className={classes.more}>
        Check my pledge
      </Typography>
    </ProductHeroLayout>
  );
}

export default withStyles(styles)(ProductHero);
