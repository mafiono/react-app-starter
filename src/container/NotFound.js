import React from "react";
import Helmet from "react-helmet-async";

import { NotFound as NotFoundComponent, ScrollTopOnMount } from "../component";
import { MaxWidth, VerticalPadder } from "../component/styled";

function NotFound() {
  return (
    <>
      <ScrollTopOnMount />
      <Helmet>
        <title>404 - Content not found</title>
      </Helmet>
      <VerticalPadder>
        <MaxWidth>
          <NotFoundComponent />
        </MaxWidth>
      </VerticalPadder>
    </>
  );
}

export default NotFound;
