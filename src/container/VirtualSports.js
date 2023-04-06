import React from "react";

import { ApiContentLoader, ApiCarousel, ApiSeoContent } from "../component/api";
import {
  VirtualSports as VirtualSportsComponent,
  ScrollTopOnMount,
} from "../component";
import { VerticalPadder } from "../component/styled";

class VirtualSports extends React.PureComponent {
  render() {
    return (
      <>
        <ScrollTopOnMount />
        <VerticalPadder>
          <ApiContentLoader
            type="virtualsport-hero_slider"
            component={ApiCarousel}
          />
        </VerticalPadder>
        <VirtualSportsComponent />
        <VerticalPadder>
          <ApiContentLoader
            type="virtualsport-seo"
            component={ApiSeoContent}
            setMeta
            canonicalUrl="virtual-sports"
          />
        </VerticalPadder>
      </>
    );
  }
}

export default VirtualSports;
