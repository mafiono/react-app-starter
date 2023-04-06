import React from "react";
import styled from "styled-components/macro";
import { Grid } from "@material-ui/core";

function GridContainer(props) {
  const { spacing, children, ...rest } = props;

  return (
    <GridContainerWrapper spacing={spacing}>
      <Grid container spacing={spacing} {...rest}>
        {children}
      </Grid>
    </GridContainerWrapper>
  );
}

const GridContainerWrapper = styled.div`
	padding: ${(p) => p.spacing / 2}px;
`;

export default GridContainer;
