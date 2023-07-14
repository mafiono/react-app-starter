import React from "react";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import { Typography, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

//import { ApiContent } from "..";
import { Helmet } from "react-helmet-async";
//import { DetailsImageContainer, Actions, ClearFix } from ".";
import { MaxWidth } from "../../styled";
import {Actions, ClearFix, DetailsImageContainer} from "./common";
import {ApiContent} from "..";

const ItemDetails = React.memo(({ backUrl, sectionTitle, item, actions }) => {
  let content = null;

  if (!item) {
    content = (
      <Typography
        color="error"
        align="center"
        variant="subtitle1"
        component="p"
      >
        Specified article doesn't exist.
      </Typography>
    );
  } else {
    content = (
      <>
        <Helmet>
          <title>{item.meta.title}</title>
          <meta name="description" content={item.meta.description} />
        </Helmet>
        {item.image.src && (
          <MaxWidth factor={86}>
            <DetailsImageContainer>
              <img
                src={process.env.REACT_APP_API_CMS_IMAGE_ROOT + item.image.src}
                alt={item.image.alt}
              />
            </DetailsImageContainer>
          </MaxWidth>
        )}
        {item.title && (
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            {item.title}
          </Typography>
        )}
        <ApiContent>{item.content}</ApiContent>
        {actions && (
          <Actions component="div" align="center">
            {actions}
          </Actions>
        )}
        <ClearFix />
      </>
    );
  }

  return (
    <>
      <Header>
        <IconButton component={Link} to={backUrl}>
          <ArrowBackIcon />
        </IconButton>
        <HeaderTitle variant="subtitle1" component="p">
          {sectionTitle}
        </HeaderTitle>
      </Header>
      {content}
    </>
  );
});

const Header = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: ${(p) => p.theme.spacing(0.5)}px;
`;

const HeaderTitle = styled(Typography)`
	margin-left: ${(p) => p.theme.spacing(2)}px;
`;

export default ItemDetails;
