import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

import { LoadingIndicator, Carousel } from "../";
import { ApiContent } from "../api";

function ApiCarousel({ content, itemWrapper: ItemWrapper, ...rest }) {
  if (content === undefined) {
    return <LoadingIndicator />;
  } else if (!content) {
    return (
      <Typography
        color="error"
        component="p"
        variant="subtitle2"
        align="center"
      >
        There was a problem while fetching data.
      </Typography>
    );
  }

  return (
    <Carousel {...rest}>
      {content.children.map((child) => {
        const { src, alt } = child.image;

        if (src) {
          let img = (
            <img
              src={process.env.REACT_APP_API_CMS_IMAGE_ROOT + src}
              alt={alt ? alt : ""}
            />
          );

          if (child.slug) {
            img = <Link to={"/" + content.slug + "/" + child.slug}>{img}</Link>;
          }

          return <ItemWrapper key={child.id + "image"}>{img}</ItemWrapper>;
        }

        return (
          <ApiContent key={child.id} component={ItemWrapper}>
            {child.content}
          </ApiContent>
        );
      })}
    </Carousel>
  );
}

ApiCarousel.propTypes = {
  itemWrapper: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  itemsPerSlide: PropTypes.number,
  type: PropTypes.string,
  content: PropTypes.object,
};

ApiCarousel.defaultProps = {
  itemWrapper: "div",
  itemsPerSlide: 1,
};

export default ApiCarousel;
