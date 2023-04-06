import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

import { ApiContent } from "..";
import { VerticalPadder } from "../../styled";
import {Actions, ClearFix, ImageContainer} from "./common";
//import { ImageContainer, Actions, ClearFix } from ".";

const ListItem = React.memo(({ item, detailsUrl, actions }) => (
  <VerticalPadder>
    {item.image.src && (
      <ImageContainer>
        <Link to={detailsUrl}>
          <img
            src={process.env.REACT_APP_API_CMS_IMAGE_ROOT + item.image.src}
            alt={item.image.alt}
          />
        </Link>
      </ImageContainer>
    )}
    <Typography variant="h6" component="h2" align="right" gutterBottom>
      <Link to={detailsUrl} className="standard no-underline">
        {item.title}
      </Link>
    </Typography>
    {item.summary && <ApiContent>{item.summary}</ApiContent>}
    {actions && (
      <Actions component="div" align="right">
        {actions}
      </Actions>
    )}
    <ClearFix />
  </VerticalPadder>
));

export default ListItem;
