import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { Typography, Grid, Button } from "@material-ui/core";

import { vigilante, support } from "../img";
import { ProviderCarousel, ApiContentLoader, PaymentCarousel } from "./api";
import { footerItems } from "../data";
import { showTawkChat } from "../util";
import { PostAffiliatePro } from ".";

const ImageText = React.memo(({ src, children }) => (
  <StyledGrid>
    <div className="img">
      <img src={src} alt="" />
    </div>
    <div>{children}</div>
  </StyledGrid>
));

const StyledGrid = styled(Grid)`
	display: flex;
	max-width: ${(p) => p.theme.spacing(150)}px;
	align-items: center;
	margin: ${(p) => p.theme.spacing(2)}px auto;
	padding: 0 ${(p) => p.theme.spacing()}px;

	& > .img {
		line-height: 0;
		flex: 0 0 auto;
		margin-right: ${(p) => p.theme.spacing(2)}px;
	}
`;

function footerLink(link) {
  return (
    <Grid item sm={4} xs={6} key={link.url}>
      <Typography
        variant="caption"
        align="center"
        color="textPrimary"
        component={Link}
        to={link.url}
      >
        {link.label}
      </Typography>
    </Grid>
  );
}

const Footer = React.memo(() => (
  <>
    <PaymentProviderWrapper>
      <div>
        <Typography
          component="p"
          variant="h6"
          color="primary"
          gutterBottom
          align="center"
        >
          Providers
        </Typography>
        <ApiContentLoader type="provider-slider" component={ProviderCarousel} />
      </div>
      <div>
        <Typography
          component="p"
          variant="h6"
          color="primary"
          gutterBottom
          align="center"
        >
          Payment method
        </Typography>
        <ApiContentLoader type="payment-slider" component={PaymentCarousel} />
      </div>
    </PaymentProviderWrapper>
    <Typography
      component="p"
      variant="h6"
      color="primary"
      gutterBottom
      align="center"
    >
      Customer support
    </Typography>
    <CustomerSupportWrapper>
      <div>
        <Typography align="center" gutterBottom>
          <img src={support} alt="" style={{ height: "100px" }} />
        </Typography>
        <Typography component="p" variant="body1" gutterBottom align="center">
          Our friendly customer service team is on hand to answer any question
          you may have 24 hours a day, 7 days a week
        </Typography>
      </div>
      <div>
        <Typography variant="caption" component="p" align="center">
          Contact us today on:
        </Typography>
        <CsButtonWrapper>
          <div>
            <Button color="primary" variant="contained" onClick={showTawkChat}>
              Live chat support
            </Button>
          </div>
          <div>
            <Button
              color="secondary"
              variant="contained"
              component={Link}
              to="/help/contact"
            >
              E-mail support
            </Button>
          </div>
        </CsButtonWrapper>
      </div>
      <PostAffiliatePro />
    </CustomerSupportWrapper>
    <StyledFooter>
      <MaxWidth>
        <Grid
          container
          spacing={16}
          alignItems="center"
          justify="center"
          direction="row-reverse"
        >
          <StretchLinkContainer
            item
            md={6}
            container
            alignItems="center"
            spacing={8}
          >
            {footerItems.map(footerLink)}
          </StretchLinkContainer>
          <Grid item md={6}>
            <ImageText src={vigilante}>
              <Typography variant="caption">
                Only players above the age of 18 and who reside in countries
                where gambling is legal are allowed to play on BetBTC.io
              </Typography>
            </ImageText>
          </Grid>
        </Grid>
      </MaxWidth>
      <Typography align="center" variant="caption">
        © 2029 BetBTC.io . All rights reserved
      </Typography>
    </StyledFooter>
  </>
));

const Splitter = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: flex-start;

	> div {
		padding: ${(p) => p.theme.spacing()}px;
		width: 50%;
	}

	${(p) => p.theme.mui.breakpoints.down("sm")} {
		flex-direction: column;
		align-items: center;

		> div {
			width: 100%;
		}
	}
`;

const CustomerSupportWrapper = styled(Splitter)`
	align-items: center;

	> div {
		max-width: 450px;
	}
`;

const PaymentProviderWrapper = styled(Splitter)`
	justify-content: space-evenly;
	padding-bottom: ${(p) => p.theme.spacing()}px;
	background-color: ${(p) => p.theme.mui.palette.background.paper};

	> div {
		max-width: 550px;
	}
`;

const CsButtonWrapper = styled.div`
	display: flex;
	padding: ${(p) => p.theme.spacing()}px 0 ${(p) => p.theme.spacing(2)}px;
	justify-content: space-evenly;
	align-items: center;
`;

const StyledFooter = styled.div`
	background-color: ${(p) => p.theme.mui.palette.primary.main};
	padding: ${(p) => p.theme.spacing()}px;
`;

const MaxWidth = styled.div`
	max-width: ${(p) => p.theme.spacing(150)}px;
	margin: 0 auto;
`;

const StretchLinkContainer = styled(Grid)`
	width: 100%;
	max-width: ${(p) => p.theme.spacing(100)}px;
`;

export default Footer;
