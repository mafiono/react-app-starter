import React from "react";
import { Helmet } from "react-helmet-async";

//import { Restrictions as RestrictionsComponent } from "../../component/profile/Restrictions";
import { VerticalPadder } from "../../component/styled";

function RestrictionsComponent() {
    return null;
}

function Restrictions() {
  return (
    <>
      <Helmet>
        <title>Restrictions</title>
      </Helmet>
      <VerticalPadder>
        <RestrictionsComponent />
      </VerticalPadder>
    </>
  );
}

export default Restrictions;
