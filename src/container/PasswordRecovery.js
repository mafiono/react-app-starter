import React from "react";
import { Redirect } from "react-router-dom";

import { MaxWidth, VerticalPadder } from "../component/styled";
import {
  PasswordRecovery as PasswordRecoveryComponent,
  ScrollTopOnMount,
} from "../component";
import { subscribeTo, PlayerContainer } from "../state";

function PasswordRecovery({ player }) {
  if (player.loggedIn()) {
    return <Redirect to="/" />;
  }

  return (
    <MaxWidth>
      <ScrollTopOnMount />
      <VerticalPadder>
        <PasswordRecoveryComponent />
      </VerticalPadder>
    </MaxWidth>
  );
}

export default subscribeTo(
  {
    player: PlayerContainer,
  },
  PasswordRecovery
);
