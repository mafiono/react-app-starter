import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { Collapse, Typography, Button } from "@material-ui/core";

import { ApiContent } from "./api";
import { VerticalPadder } from "./styled";

class SeoContent extends React.PureComponent {
  static propTypes = {
    aboveTheFold: PropTypes.string,
  };

  static defaultProps = {
    aboveTheFold: null,
  };

  state = {
    expand: false,
  };

  render() {
    const { expand } = this.state;
    const { aboveTheFold, children } = this.props;

    return (
      <Wrapper>
        {aboveTheFold && (
          <VerticalPadder>
            <ApiContent>{aboveTheFold}</ApiContent>
          </VerticalPadder>
        )}
        {children && (
          <Collapse in={expand} collapsedHeight="1px">
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Collapse>
        )}
        <VerticalPadder>
          <Typography align="center">
            <Button variant="outlined" onClick={this.toggleExpand}>
              {expand ? "Show less" : "Read more"}
            </Button>
          </Typography>
        </VerticalPadder>
      </Wrapper>
    );
  }

  toggleExpand = () => this.setState({ expand: !this.state.expand });
}

const Wrapper = styled.div`
	max-width: 830px;
	margin: 0 auto;
`;

const ChildrenWrapper = styled.div`
	padding-top: 1px;
`;

export default SeoContent;
