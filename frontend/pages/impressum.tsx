import * as React from "react";
import Markdown from "../src/components/Markdown";
import withRoot from "../src/withRoot";
import impressum from "../src/views/markdowns/impressum.md";

import PageContainer from "../src/components/PageContainer";

function Impressum() {
  return (
    <PageContainer title="Impressum">
      <Markdown>{impressum}</Markdown>
    </PageContainer>
  );
}

export default withRoot(Impressum);
