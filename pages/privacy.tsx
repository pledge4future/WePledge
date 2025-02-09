import * as React from "react";
import Markdown from "../src/components/Markdown";
import withRoot from "../src/withRoot";
import privacy from "../src/views/markdowns/privacy.md";

import PageContainer from "../src/components/PageContainer";

function Privacy() {
  return (
    <PageContainer title="Privacy">
      <Markdown>{privacy}</Markdown>
    </PageContainer>
  );
}

export default withRoot(Privacy);
