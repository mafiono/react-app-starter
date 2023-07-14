import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { JssProvider } from "react-jss";
import { create } from "jss";
import { createGenerateClassName, jssPreset, MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import deepmerge from "deepmerge";
import qs from "query-string";

import { muiThemeCommon, defaultMuiThemeColors } from "./theme";
import "./index.css";
import App from "./App";
import { isMobileBrowser } from "./util";

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById("jss-insertion-point"),
});

const defaultMuiTheme = createTheme(
  deepmerge(defaultMuiThemeColors, muiThemeCommon)
);

const isMobile = isMobileBrowser();
const muiServerCssEl = document.getElementById("jss-css");

class Client extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aAid: null,
      aBid: null,
    };

    const searchQuery = qs.parse(window.location.search);

    if (searchQuery.a_aid) {
      this.state.aAid = searchQuery.a_aid;

      if (searchQuery.a_bid) {
        this.state.aBid = searchQuery.a_bid;
      }
    }
  }

  componentDidMount() {
    if (muiServerCssEl && muiServerCssEl.parentNode) {
      muiServerCssEl.parentNode.removeChild(muiServerCssEl);
    }
  }

  render() {
    const { aAid, aBid } = this.state;

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={defaultMuiTheme}>
          <HelmetProvider>
            <App
              muiTheme={defaultMuiTheme}
              isMobile={isMobile}
              aAid={aAid}
              aBid={aBid}
            />
          </HelmetProvider>
        </MuiThemeProvider>
      </JssProvider>
    );
  }
}


//*

const rootEl = document.getElementById('root');

/*
if (muiServerCssEl !== null) {
	console.log('React.hydrate()');
	ReactDOM.hydrate(<Client />, rootEl);
} else {
	console.log('React.render()');
//*/
	ReactDOM.render(<Client />, rootEl);
/*
}

//*/