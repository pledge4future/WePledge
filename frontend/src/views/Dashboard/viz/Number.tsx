import React from "react";

// MUI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "../../../components/CircularProgress";

// CUBE
import { cubejsApi } from "../../../utils/helpers";
import { useCubeQuery } from "@cubejs-client/react";
import { Query } from "@cubejs-client/core";
import { ResultSet } from "../../../interfaces/Types/cube";

const useStyles = makeStyles({
  root: {},
});

export function CardRenderer({ title, query }: { title: string; query: Query }) {
  const classes = useStyles();
  const { resultSet, error, isLoading } = useCubeQuery(query, { cubejsApi });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error.toString()}</div>;
  }

  if (!resultSet) {
    return null;
  }

  if (resultSet) {
    let fullValue = resultSet.seriesNames().map((s) => resultSet.totalRow()[s.key])[0];

    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid>
              <Typography variant="h5" component="h2">
                {fullValue}
              </Typography>
            </Grid>
            <Grid>
              <Typography color="textSecondary">{title}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

interface Props {
  resultSet: ResultSet;
  options?: NumberOptions;
}

export interface NumberOptions {
  valueSuffix: string;
}

const NumberRender: React.FC<Props> = ({ resultSet, options }) => {
  let fullValue = resultSet.seriesNames().map((s: any) => resultSet.totalRow()[s.key])[0];
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid>
        <Typography variant="h5" component="h2">
          {fullValue}
        </Typography>
      </Grid>
      <Grid>
        <Typography color="textSecondary">{options?.valueSuffix}</Typography>
      </Grid>
    </Grid>
  );
};

export default NumberRender;
