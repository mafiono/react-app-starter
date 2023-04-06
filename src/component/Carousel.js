import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import SwipeableViews from "react-swipeable-views";

const Pagination = styled.ol`
	display: flex;
	list-style: none;
	margin: 1em 0 0;
	padding: 0;
	justify-content: center;

	& > li {
		background: ${(p) => p.theme.mui.palette.background.default};
		border: 1px solid ${(p) => p.theme.mui.palette.primary.main};
		border-radius: 50%;
		width: 2.3em;
		height: 2.3em;
		margin: 0 .5em;
		cursor: pointer;

		&.active {
			background: ${(p) => p.theme.mui.palette.primary.main};
		}
	}
`;

export const ResponsiveImageContainer = styled.div`
	width: 100%;
	height: 0;
	position: relative;
	overflow: hidden;

	& img {
		width: 100%;
		position: absolute;
	}
`;

class Carousel extends React.PureComponent {
  static propTypes = {
    itemsPerSlide: PropTypes.number.isRequired,
  };

  static defaultProps = {
    itemsPerSlide: 1,
  };

  state = {
    index: null,
    lastItemsPerSlide: null,
  };

  static getDerivedStateFromProps(props, state) {
    let returnedState = null;
    const { itemsPerSlide } = props;
    const { index, lastItemsPerSlide } = state;

    if (index === null) {
      returnedState = {
        index: 0,
        lastItemsPerSlide: itemsPerSlide,
      };
    } else {
      if (lastItemsPerSlide !== itemsPerSlide) {
        returnedState = {
          index: 0,
          lastItemsPerSlide: itemsPerSlide,
        };
      }
    }

    return returnedState;
  }

  render() {
    const { index } = this.state;
    const { children } = this.props;

    let wrappedChildren = [];
    const paginationItems = [];

    if (children) {
      const { itemsPerSlide } = this.props;
      let slideGroup = [];

      React.Children.forEach(children, (child, index) => {
        if (index > 0 && index % itemsPerSlide === 0) {
          wrappedChildren.push(
            <SliderWrapper key={wrappedChildren.length}>
              {slideGroup.length === 1 ? slideGroup[0] : slideGroup}
            </SliderWrapper>
          );
          slideGroup = [];
        }

        slideGroup.push(
          <ChildWrapper key={`slide_${index}`} itemsPerSlide={itemsPerSlide}>
            {child}
          </ChildWrapper>
        );
      });

      wrappedChildren.push(
        <SliderWrapper key={wrappedChildren.length}>
          {slideGroup.length === 1 ? slideGroup[0] : slideGroup}
        </SliderWrapper>
      );

      let i = 0;

      if (wrappedChildren.length > 1) {
        while (i < wrappedChildren.length) {
          paginationItems.push(
            <li
              key={i}
              className={i === index ? "active" : undefined}
              onClick={this.handlePaginationClick(i)}
            />
          );
          i++;
        }
      }
    }

    return (
      <div>
        <SwipeableViews
          index={index}
          onChangeIndex={this.handleChangeIndex}
          resistance
        >
          {wrappedChildren}
        </SwipeableViews>
        {paginationItems.length > 0 && (
          <Pagination>{paginationItems}</Pagination>
        )}
      </div>
    );
  }

  wrapChildren = (child) => {
    const { itemsPerSlide } = this.props;

    return <ChildWrapper itemsPerSlide={itemsPerSlide}>{child}</ChildWrapper>;
  };

  handleChangeIndex = (index) => this.setState({ index });

  handlePaginationClick = (index) => () => this.handleChangeIndex(index);
}

const SliderWrapper = styled.div`
	display: flex;
	justify-content: space-evenly;
`;

const ChildWrapper = styled.div`
	padding: ${(p) => p.theme.spacing()}px;
	display: inline-block;
	width: calc(100% / ${(p) => p.itemsPerSlide});
`;

export default Carousel;
