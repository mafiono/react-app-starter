import React from "react";
import styled from "styled-components/macro";
import {
  Snackbar,
  SnackbarContent,
  Typography,
  IconButton,
} from "@material-ui/core";
import { default as CloseIcon } from "@material-ui/icons/Close";

function Notification({
  children,
  onClose,
  message,
  action,
  ContentProps,
  ...rest
}) {
  if (!action) {
    action = (
      <IconButton aria-label="Close" color="inherit" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    );
  }

  return (
    <StyledSnackbar
      onClose={onClose}
      message={message}
      action={action}
      {...ContentProps}
      {...rest}
    >
      {children || (
        <StyledSnackbarContent
          message={
            <Typography
              color="inherit"
              variant="inherit"
              component="p"
              align="center"
            >
              {message}
            </Typography>
          }
          action={action}
          {...ContentProps}
        />
      )}
    </StyledSnackbar>
  );
}

const StyledSnackbar = styled(Snackbar)`
	bottom: ${(p) => p.theme.spacing()}px;
`;

const StyledSnackbarContent = styled(SnackbarContent)`
	background: ${(p) => p.theme.mui.palette.background.notification};
	color: ${(p) => p.theme.mui.palette.action.active};
	font-size: ${(p) => p.theme.pxToRem(14)};
`;

export default Notification;
