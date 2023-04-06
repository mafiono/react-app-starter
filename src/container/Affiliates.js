import React from "react";

import { ApiContentLoader } from "../component/api";
import { VerticalPadder, MaxWidth } from "../component/styled";
import { ScrollTopOnMount } from "../component";

function Affiliates() {
  return (
    <VerticalPadder>
      <ScrollTopOnMount />
      <MaxWidth>
        <ApiContentLoader
          type="affiliates"
          setMeta
          canonicalUrl="affiliates"
          showContentTitle
        />
      </MaxWidth>
    </VerticalPadder>
  );
}

export default Affiliates;
