import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import Helmet from "react-helmet-async";

import { ApiContent } from ".";
import { LoadingIndicator, ScrollTopOnMount, NotFound } from "..";
import { VerticalPadder } from "../styled";
import { sortByPosition, canonicalize } from "../../util";

function ApiContentDirectory(props) {
  const { content } = props;

  if (!content) {
    return <LoadingIndicator />;
  }

  const {
    canonical: canonicalUrl,
    activeItemUrl,
    listItemComponent,
    detailsItemComponent: DetailsComponent,
  } = props;

  if (activeItemUrl) {
    const item = content.children.find((c) => c.slug === activeItemUrl);

    if (!item) {
      return (
        <>
          <Helmet key="notFoundHelmet">
            <title>404 - Content not found</title>
          </Helmet>
          <ScrollTopOnMount key="notFound" />
          <NotFound />
        </>
      );
    }

    return (
      <>
        {canonicalUrl && (
          <Helmet key="detailsHelmet">
            <link
              rel="canonical"
              href={canonicalize(`${canonicalUrl}/${item.slug}`)}
            />
          </Helmet>
        )}
        <ScrollTopOnMount key="details" />
        <DetailsComponent item={item} />
      </>
    );
  } else {
    return (
      <>
        {canonicalUrl && (
          <Helmet key="listHelmet">
            <link rel="canonical" href={canonicalize(canonicalUrl)} />
          </Helmet>
        )}
        <ScrollTopOnMount key="list" />
        <List content={content} itemComponent={listItemComponent} />
      </>
    );
  }
}

ApiContentDirectory.propTypes = {
  content: PropTypes.object,
  hideTitle: PropTypes.bool,
  activeItemUrl: PropTypes.string,
  canonical: PropTypes.string,
  listItemComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  detailsItemComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
};

ApiContentDirectory.defaultProps = {
  hideTitle: false,
  listItemComponent: ListItem,
  detailsItemComponent: Item,
};

function List(props) {
  let listContent = null;
  const { content: contentProp, itemComponent: ItemComponent } = props;

  if (
    !Array.isArray(contentProp.children) ||
    contentProp.children.length === 0
  ) {
    listContent = (
      <Typography color="error" align="center" variant="h6">
        No content yet...
      </Typography>
    );
  } else {
    const sortedContent = contentProp.children.slice(0).sort(sortByPosition);

    listContent = sortedContent.map((item) => (
      <ItemComponent key={item.id} item={item} />
    ));
  }

  return (
    <>
      {contentProp.title && (
        <Typography variant="h5" component="p" gutterBottom>
          {contentProp.title}
        </Typography>
      )}
      {contentProp.summary && <ApiContent>{contentProp.summary}</ApiContent>}
      {listContent}
    </>
  );
}

function ListItem(props) {
  const { item } = props;

  return (
    <VerticalPadder>
      <Typography variant="h6" gutterBottom>
        {item.title}
      </Typography>
      {item.summary && <ApiContent>{item.summary}</ApiContent>}
    </VerticalPadder>
  );
}

function Item(props) {
  const { item } = props;
  let content = null;

  if (!item) {
    content = (
      <Typography color="error">Specified item doesn't exist.</Typography>
    );
  } else {
    content = <ApiContent>{item.content}</ApiContent>;
  }

  return (
    <>
      {item.title && (
        <Typography variant="h5" component="p" gutterBottom>
          {item.title}
        </Typography>
      )}
      {item.summary && <ApiContent>{item.summary}</ApiContent>}
      {content}
    </>
  );
}

export default ApiContentDirectory;
