import React from "react";
import styled from "styled-components/macro";
import { withWidth } from "@material-ui/core";
import { isWidthDown } from "@material-ui/core/withWidth";

import { ResponsiveImageContainer } from "../Carousel";
import { ApiCarousel } from ".";

const PromoImageContainer = styled(ResponsiveImageContainer)`
	padding: 0 0 63.11239%;
	border-radius: 1em;
`;

const PromoCarousel = withWidth()(({ children, width, ...rest }) => {
  let itemsPerSlide = 3;

  if (isWidthDown("xs", width)) {
    itemsPerSlide = 1;
  } else if (isWidthDown("sm", width)) {
    itemsPerSlide = 2;
  }

  return (
    <ApiCarousel
      itemWrapper={PromoImageContainer}
      itemsPerSlide={itemsPerSlide}
      {...rest}
    />
  );
});

const ProviderImageContainer = styled(ResponsiveImageContainer)`
	padding: 0 0 67.7777%;
`;

const ProviderCarousel = withWidth()(({ children, width, ...rest }) => {
  let itemsPerSlide = 5;

  if (isWidthDown("xs", width)) {
    itemsPerSlide = 3;
  }

  return (
    <ApiCarousel
      itemWrapper={ProviderImageContainer}
      itemsPerSlide={itemsPerSlide}
      {...rest}
    />
  );
});

const PaymentImageContainer = styled(ResponsiveImageContainer)`
	padding: 0 0 62.5%;
	border-radius: .5em;
`;

const PaymentCarousel = withWidth()(({ children, width, ...rest }) => {
  let itemsPerSlide = 5;

  if (isWidthDown("xs", width)) {
    itemsPerSlide = 4;
  } else if (isWidthDown("sm", width)) {
    itemsPerSlide = 6;
  }

  return (
    <ApiCarousel
      itemWrapper={PaymentImageContainer}
      itemsPerSlide={itemsPerSlide}
      {...rest}
    />
  );
});

export { PromoCarousel, ProviderCarousel, PaymentCarousel };
