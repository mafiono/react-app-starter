import React from "react";
import { Redirect } from "react-router-dom";

import { MaxWidth, VerticalPadder } from "../component/styled";
import {
  ResetPassword as ResetPasswordComponent,
  ScrollTopOnMount,
} from "../component";
import { subscribeTo, PlayerContainer } from "../state";

function ResetPassword({ player, match }) {
  if (player.loggedIn()) {
    return <Redirect to="/" />;
  }

  return (
    <MaxWidth>
      <ScrollTopOnMount />
      <VerticalPadder>
        <ResetPasswordComponent token={match.params.token} />
      </VerticalPadder>
    </MaxWidth>
  );
}

export default subscribeTo(
  {
    player: PlayerContainer,
  },
  ResetPassword
);
