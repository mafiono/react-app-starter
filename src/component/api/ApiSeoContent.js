import React from "react";
import PropTypes from "prop-types";

import { SeoContent } from "..";
import { ApiContent } from ".";

function ApiSeoContent({ content }) {
  if (!content) {
    return null;
  }

  return (
    <SeoContent aboveTheFold={content.summary}>
      <ApiContent>{content.content}</ApiContent>
    </SeoContent>
  );
}

ApiSeoContent.propTypes = {
  content: PropTypes.object,
};

export default ApiSeoContent;
