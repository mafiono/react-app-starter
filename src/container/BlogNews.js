import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

import {
  ApiContentDirectory,
  ApiContentLoader,
  ApiCarousel,
} from "../component/api";
import { VerticalPadder, MaxWidth } from "../component/styled";
import ItemDetails from "../component/api/article/ItemDetails";
import ListItem from "../component/api/article/ListItem";
import { ScrollTopOnMount } from "../component";

function BlogNews(props) {
  const { article: articleUrl } = props.match.params;

  return (
    <>
      <ScrollTopOnMount />
      {!articleUrl && (
        <VerticalPadder>
          <ApiContentLoader type="blog-hero_slider" component={ApiCarousel} />
        </VerticalPadder>
      )}
      <VerticalPadder>
        <MaxWidth>
          <ApiContentLoader
            type="blog-and-news"
            component={ApiContentDirectory}
            activeItemUrl={articleUrl}
            listItemComponent={ListArticle}
            detailsItemComponent={Article}
            canonical="blog-news"
            setMeta
          />
        </MaxWidth>
      </VerticalPadder>
    </>
  );
}

const Article = React.memo(({ item }) => {
  return (
    <ItemDetails item={item} backUrl="/blog-news" sectionTitle="Blog & News" />
  );
});

const ListArticle = React.memo(({ item }) => {
  const detailsUrl = `/blog-news/${item.slug}`;

  return (
    <ListItem
      item={item}
      detailsUrl={detailsUrl}
      actions={
        <Button
          variant="contained"
          component={Link}
          to={detailsUrl}
          color="primary"
        >
          Continue reading
        </Button>
      }
    />
  );
});

export default BlogNews;
