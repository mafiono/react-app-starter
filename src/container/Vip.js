import React from "react";

import { ApiContentLoader } from "../component/api";
import { VerticalPadder } from "../component/styled";
import { ScrollTopOnMount } from "../component";

class Vip extends React.PureComponent {
  render() {
    return (
      <>
        <ScrollTopOnMount />
        <VerticalPadder>
          <ApiContentLoader type="vip-seo" setMeta canonicalUrl="vip" />
        </VerticalPadder>
      </>
    );
  }
}

export default Vip;
