import React from "react";

import { isAuthorized } from "./hoc";
import { OpenGameFromList } from "./api";

function VirtualSports() {
  return <OpenGameFromList providers="_kiron" />;
}

export default isAuthorized(VirtualSports, {
  titleMessage: "You need an account to play",
  contentMessage: "Please login or create an account to play.",
});
