import * as React from "react";
import withRoot from "../src/withRoot";

import PageContainer from "../src/components/PageContainer";
import Dashboard from "../src/views/Dashboard";

function DashboardPage() {
  return (
    <PageContainer title={"Dashboard"}>
      <Dashboard />
    </PageContainer>
  );
}

export default withRoot(DashboardPage);
