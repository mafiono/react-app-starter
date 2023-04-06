import styled from "styled-components/macro";
import { Typography } from "@material-ui/core";

import { ResponsiveImageContainer } from "../../Carousel";

const ImageContainer = styled(ResponsiveImageContainer)`
	padding: 0 0 63.7681%;
	border-radius: 1rem;
	margin-bottom: ${(p) => p.theme.spacing()}px;

	@media (min-width: 600px) {
		padding: 0;
		height: auto;
		line-height: 0;
		margin-right: ${(p) => p.theme.spacing(2)}px;
		margin-bottom: ${(p) => p.theme.spacing(2)}px;
		float: left;
		max-width: 350px;

		& img {
			position: relative;
		}
	}

	@media (min-width: 800px) {
		max-width: 500px;
	}
`;

const DetailsImageContainer = styled(ResponsiveImageContainer)`
	padding: 0 0 63.7681%;
	border-radius: 1rem;
	margin: 0 auto ${(p) => p.theme.spacing()}px;

	@media (min-width: 600px) {
		margin-bottom: ${(p) => p.theme.spacing(2)}px;
	}
`;

const ClearFix = styled.div`
	clear: both;
`;

const Actions = styled(Typography)`
	margin-top: ${(p) => p.theme.spacing(5)}px;

	& > * {
		margin: ${(p) => p.theme.spacing()}px;
		margin-top: 0;
	}
`;

export { ImageContainer, DetailsImageContainer, ClearFix, Actions };
