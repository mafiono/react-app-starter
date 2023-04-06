import React from "react";

import { ApiContentLoader } from "../component/api";
import { VerticalPadder, MaxWidth } from "../component/styled";
import { ScrollTopOnMount } from "../component";

function AboutUs() {
  return (
    <VerticalPadder>
      <ScrollTopOnMount />
      <MaxWidth>
        <ApiContentLoader
          type="about_us"
          setMeta
          canonicalUrl="about-us"
          showContentTitle
          contentTitleComponent="h1"
        />
      </MaxWidth>
    </VerticalPadder>
  );
}

export default AboutUs;
