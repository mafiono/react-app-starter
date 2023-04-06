import styled from "styled-components/macro";

const Spacer = styled.div`
	padding: ${(p) => p.theme.spacing(2)}px;
	min-height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default Spacer;
