import React from "react";
import { Helmet } from "react-helmet-async";

//import { BonusHistory as BonusHistoryComponent } from "../../component/profile";
import { VerticalPadder } from "../../component/styled";

function BonusHistoryComponent() {
    return null;
}

function BonusHistory() {
  return (
    <>
      <Helmet>
        <title>Bonus history</title>
      </Helmet>
      <VerticalPadder>
        <BonusHistoryComponent />
      </VerticalPadder>
    </>
  );
}

export default BonusHistory;
