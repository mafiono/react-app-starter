import React from "react";
import qs from "query-string";

import { MaxWidth, VerticalPadder } from "../component/styled";
import {
  ConfirmSignUp as ConfirmSignUpComponent,
  ScrollTopOnMount,
} from "../component";

function ConfirmSignUp({ location }) {
  const token = qs.parse(location.search).token || "";

  return (
    <MaxWidth>
      <ScrollTopOnMount />
      <VerticalPadder>
        <ConfirmSignUpComponent token={token} />
      </VerticalPadder>
    </MaxWidth>
  );
}

export default ConfirmSignUp;
