import PropTypes from "prop-types";
import styled from "styled-components/macro";

const VerticalPadder = styled.div`
	display: block;
	padding-top: ${(p) => p.theme.spacing(p.top)}px;
	padding-bottom: ${(p) => p.theme.spacing(p.bottom)}px;
	padding-left: ${(p) => p.theme.spacing(p.left)}px;
	padding-right: ${(p) => p.theme.spacing(p.right)}px;
	${({ align }) => (align ? `text-align: ${align};` : "")}
`;

VerticalPadder.propTypes = {
  top: PropTypes.number,
  bottom: PropTypes.number,
};

VerticalPadder.defaultProps = {
  top: 2,
  bottom: 2,
  left: 0,
  right: 0,
  align: undefined,
};

export default VerticalPadder;
