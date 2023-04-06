import styled from "styled-components/macro";

const MaxWidth = styled.div`
	display: block;
	max-width: ${(p) => p.theme.spacing(p.factor || 135)}px;
	margin: 0 auto;
`;

export default MaxWidth;
