import React from "react";
import { inBrowser } from "../util";

class ScrollTopOnMount extends React.Component {
  componentDidMount() {
    if (inBrowser) {
      window.scrollTo(0, 0);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

export default ScrollTopOnMount;
