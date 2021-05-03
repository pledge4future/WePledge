import { CircularProgress as MUICircularProgress } from "@material-ui/core";

const CircularProgress = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <MUICircularProgress color="secondary" />
  </div>
);

export default CircularProgress;
