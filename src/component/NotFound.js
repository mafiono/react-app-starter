import React from "react";
import { Typography, Paper } from "@material-ui/core";

import { VerticalPadder } from "./styled";

function NotFound() {
  return (
    <Paper>
      <VerticalPadder>
        <Typography align="center" component="p" gutterBottom>
          Ups, 404! The content you are looking for doesn't exist.
        </Typography>
        <Typography align="center" component="p" gutterBottom>
          Please check the URL in the browser
        </Typography>
      </VerticalPadder>
    </Paper>
  );
}

export default NotFound;
