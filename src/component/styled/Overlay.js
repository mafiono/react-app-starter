import React from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div`
	position: relative;
`;

const OverlayContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	transition: ${(p) => p.theme.createTransition("opacity")};
	opacity: ${(p) => (p.active ? "1" : "0")};
	height: ${(p) => (p.active ? "100%" : "0")};
	visibility: ${(p) => (p.active ? "visible" : "hidden")};
	${(p) =>
    p.noOverlayBg
      ? ""
      : "background: rgba(0, 0, 0, .1) radial-gradient(rgba(0, 0, 0, .6), transparent);"}
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

function Overlay({ children, wrapper, active, noOverlayBg }) {
  if (wrapper) {
    return <Wrapper>{children}</Wrapper>;
  }

  return (
    <OverlayContainer active={active} noOverlayBg={noOverlayBg}>
      {children}
    </OverlayContainer>
  );
}

Overlay.defaultProps = {
  wrapper: null,
  active: false,
  noOverlayBg: false,
};

Overlay.Wrapper = Wrapper;

export default Overlay;
