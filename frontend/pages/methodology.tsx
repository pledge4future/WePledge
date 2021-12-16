import * as React from "react";
import Markdown from "../src/components/Markdown";
import withRoot from "../src/withRoot";
import methodology from "../src/views/markdowns/methodology.md";

import PageContainer from "../src/components/PageContainer";

function Methodology() {
  return (
    <PageContainer title="Methodology">
      <Markdown>{methodology}</Markdown>
    </PageContainer>
  );
}

export default withRoot(Methodology);
