import * as React from "react";
import withRoot from "../src/withRoot";

import PageContainer from "../src/components/PageContainer";
import EmissionEstimation from "../src/views/EmissionEstimation";

function DashboardPage() {
  return (
    <PageContainer title={"Emission Estimation"} showTitle={true}>
      <EmissionEstimation />
    </PageContainer>
  );
}

export default withRoot(DashboardPage);