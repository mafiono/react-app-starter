export const defaultMuiThemeColors = {
  palette: {
    action: {
      active: "#fff",
      hover: "rgba(255, 255, 255, .1)",
      selected: "rgba(255, 255, 255, .28)",
    },
    background: {
      default: "#212b34",
      paper: "#2a333b",
      notification: "#2d4c69",
    },
    primary: {
      light: "#e7c081",
      main: "#b39053",
      dark: "#816328",
      contrastText: "#fff",
    },
    secondary: {
      light: "#54616d",
      main: "#2b3742",
      dark: "#02111b",
      contrastText: "#fff",
    },
    text: {
      primary: "#e3e3e3",
      secondary: "rgba(255, 255, 255, .7)",
      disabled: "rgba(255, 255, 255, .45)",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        color: "#fff",
      },
    },
    MuiFormHelperText: {
      root: {
        marginBottom: ".3em",
        "& p": {
          margin: 0,
          marginBottom: ".3em",
        },
      },
    },
  },
};

export const muiThemeCommon = {
  palette: {
    type: "dark",
  },
  typography: {
    useNextVariants: true,
    fontSize: 16,
    htmlFontSize: 12,
    fontFamily: [
      '"Montserrat"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(", "),
  },
};
