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

function Promotions(props) {
  const { promotion: articleUrl } = props.match.params;

  return (
    <>
      <ScrollTopOnMount />
      {!articleUrl && (
        <VerticalPadder>
          <ApiContentLoader
            type="promotions-hero_slider"
            component={ApiCarousel}
          />
        </VerticalPadder>
      )}
      <VerticalPadder>
        <MaxWidth>
          <ApiContentLoader
            type="promotions"
            component={ApiContentDirectory}
            activeItemUrl={articleUrl}
            listItemComponent={ListArticle}
            detailsItemComponent={Article}
            canonical="promotions"
            setMeta
          />
        </MaxWidth>
      </VerticalPadder>
    </>
  );
}

const Article = React.memo(({ item }) => {
  return (
    <ItemDetails
      item={item}
      backUrl="/promotions"
      sectionTitle="Promotions"
      actions={
        <Button
          variant="contained"
          component={Link}
          to="/cashier"
          color="secondary"
        >
          To Cashier
        </Button>
      }
    />
  );
});

const ListArticle = React.memo(({ item }) => {
  const detailsUrl = `/promotions/${item.slug}`;

  return (
    <ListItem
      item={item}
      detailsUrl={detailsUrl}
      actions={
        <>
          <Button
            variant="contained"
            component={Link}
            to={detailsUrl}
            color="primary"
          >
            Continue reading
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/cashier"
            color="secondary"
          >
            To Cashier
          </Button>
        </>
      }
    />
  );
});

export default Promotions;
