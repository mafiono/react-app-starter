import React from "react";

import { ApiContentLoader, ApiExpandableContent } from "../../component/api";
import { VerticalPadder, MaxWidth } from "../../component/styled";

class HowToPlay extends React.PureComponent {
  render() {
    const { article: articleUrl } = this.props.match.params;

    return (
      <VerticalPadder>
        <MaxWidth>
          <ApiContentLoader
            type="how_to_play"
            component={ApiExpandableContent}
            setMeta
            canonicalUrl="help/how-to-play"
            expanded={articleUrl}
            onChange={this.handleChange}
          />
        </MaxWidth>
      </VerticalPadder>
    );
  }

  handleChange = (child, expand) => {
    const { history } = this.props;

    if (expand) {
      history.push(`/help/how-to-play/${child.slug}`);
    } else {
      history.push("/help/how-to-play");
    }
  };
}

export default HowToPlay;
