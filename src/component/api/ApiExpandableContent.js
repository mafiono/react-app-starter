import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Helmet from "react-helmet-async";

import { LoadingIndicator } from "../";
import { ApiContent } from "./";
import { canonicalize } from "../../util";

function ApiExpandableContent(props) {
  const {
    content,
    expanded,
    onChange,
    setMeta,
    canonicalUrl: canonicalUrlProp,
  } = props;

  if (!content) {
    return <LoadingIndicator />;
  }

  if (content.children.length === 0) {
    return (
      <Typography component="p" variant="subtitle1" align="center">
        No content at the moment...
      </Typography>
    );
  }

  let expandedChild = null;
  let canonicalUrl = null;

  const children = content.children.map((child) => {
    const isExpanded = child.slug === expanded;
    let to = canonicalUrlProp;

    if (typeof to === "string") {
      to = `/${to}/${child.slug}`;
    }

    if (isExpanded) {
      expandedChild = child;

      if (typeof canonicalUrlProp === "string") {
        canonicalUrl = canonicalize(`${canonicalUrlProp}/${child.slug}`);
      }
    }

    return (
      <ExpansionPanel
        key={child.id}
        expanded={isExpanded}
        onChange={(ev, expand) => onChange(child, expand)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {isExpanded && (
            <Title component="h1" color="primary">
              {child.title}
            </Title>
          )}
          {!isExpanded && (
            <Title component={Link} to={to}>
              {child.title}
            </Title>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {isExpanded && <ApiContent>{child.content}</ApiContent>}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  });

  let seo = null;

  if (setMeta) {
    seo = [
      <title key="title">
        {expandedChild ? expandedChild.meta.title : content.meta.title}
      </title>,
      <meta
        key="desc"
        name="description"
        content={
          expandedChild
            ? expandedChild.meta.description
            : content.meta.description
        }
      />,
    ];

    if (canonicalUrl) {
      seo.push(<link key="canonical" rel="canonical" href={canonicalUrl} />);
    }
  }

  return (
    <>
      {seo && <Helmet>{seo}</Helmet>}
      {children}
    </>
  );
}

const Title = styled(Typography)`
	font-size: ${(p) => p.theme.mui.typography.pxToRem(15)};
	flex-basis: 33.33%;
	flex-shrink: 0;
	min-width: ${(p) => p.theme.spacing(25)}px;
	text-decoration: none;
`;

export default ApiExpandableContent;
