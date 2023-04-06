import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { Typography, Button, Grid } from "@material-ui/core";

import { GridContainer } from "../styled";

class PaymentMethods extends React.PureComponent {
  static propTypes = {
    actionText: PropTypes.oneOf(["Deposit", "Withdraw"]).isRequired,
    cashierMethods: PropTypes.arrayOf(PropTypes.object),
    method: PropTypes.object,
    onMethodSelected: PropTypes.func.isRequired,
  };

  render() {
    const { cashierMethods } = this.props;

    return (
      <GridContainer direction="column" spacing={16}>
        {cashierMethods.map(this.renderPaymentMethod)}
      </GridContainer>
    );
  }

  renderPaymentMethod = (method) => {
    const { method: methodProp, actionText } = this.props;

    return (
      <GridItem
        item
        key={method.code}
        selected={methodProp && method.code === methodProp.code}
      >
        <ImageContainer>
          <img
            src={process.env.REACT_APP_API_IMAGE_ROOT + method.image}
            aria-label={method.name}
            alt=""
          />
        </ImageContainer>
        <Info>
          <div className="main">
            <Typography variant="subtitle1" noWrap>
              {method.name}
            </Typography>
            <Typography variant="caption">
              {method.isInstant ? "Instant!" : method.timeStr}
            </Typography>
          </div>
          <div className="limits">
            <Typography variant="caption">
              {method.limits.maxAmountStr}
            </Typography>
            <Typography variant="caption">
              {method.limits.minAmountStr}
            </Typography>
          </div>
        </Info>
        <div>
          <Button
            onClick={this.handleMethodSelect(method.code)}
            variant="contained"
            color="primary"
          >
            {actionText}
          </Button>
        </div>
      </GridItem>
    );
  };

  handleMethodSelect = (code) => () => {
    const { onMethodSelected } = this.props;

    if (onMethodSelected) {
      const { cashierMethods } = this.props;
      const method = cashierMethods.filter((m) => m.code === code)[0];

      onMethodSelected(method);
    }
  };
}

const GridItem = styled(Grid)`
	display: flex;
	flex-wrap: nowrap;
	align-items: center;

	${(p) => (p.selected ? "border: 1px solid #f00;" : null)}
`;

const ImageContainer = styled.div`
	line-height: 0;
	width: 20%;
	max-width: 102px;

	${(p) => p.theme.mui.breakpoints.down("xs")} {
		img {
			width: 100%;
		}
	}
`;

const Info = styled.div`
	flex-grow: 1;
	padding-left: ${(p) => p.theme.spacing(2)}px;
	display: flex;
	align-items: center;

	& > div.main {
		width: 40%;
		max-width: ${(p) => p.theme.spacing(25)}px;
	}

	& > div.limits {
		padding-left: ${(p) => p.theme.spacing()}px;
	}

	${(p) => p.theme.mui.breakpoints.down("xs")} {
		flex-direction: column;
		align-items: flex-start;

		& > div.main {
			width: 100%;
		}

		& > div.limits {
			padding-left: 0;
		}
	}
`;

export default PaymentMethods;
