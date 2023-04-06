import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { CircularProgress, Typography } from "@material-ui/core";

import { Overlay } from "./styled";

function LoadingIndicator({
  active,
  height,
  children,
  loadingMessage,
  noOverlayBg,
}) {
  if (children) {
    return (
      <Overlay.Wrapper>
        {children}
        <Overlay active={active} noOverlayBg={noOverlayBg}>
          {loadingMessage && (
            <LoadingMessage variant="subtitle1" paragraph>
              {loadingMessage}
            </LoadingMessage>
          )}
          <CircularProgress />
        </Overlay>
      </Overlay.Wrapper>
    );
  }

  if (!active) {
    return null;
  }

  return (
    <LoadingWrapper height={height}>
      <CircularProgress />
    </LoadingWrapper>
  );
}

LoadingIndicator.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  active: PropTypes.bool,
  loadingMessage: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  active: true,
  loadingMessage: "Loading...",
};

const LoadingWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	${(p) => {
    const { height: heightProp } = p;
    let height = null;

    if (typeof heightProp === "number" || !isNaN(heightProp)) {
      height = heightProp + "px";
    } else if (typeof heightProp === "string") {
      height = heightProp;
    }

    if (height !== null) {
      return `height: ${height};`;
    }

    return null;
  }}
`;

const LoadingMessage = styled(Typography)`
	text-shadow: 0 0px 4px rgba(255, 255, 255, .8);
	border-radius: 50%;
`;

export default LoadingIndicator;
