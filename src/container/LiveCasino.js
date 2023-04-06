import React from "react";
import { Grid, Typography, Button, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";

import {
  ApiContentLoader,
  ApiCarousel,
  ApiSeoContent,
  OpenGameFromList,
} from "../component/api";
import { providerDefinitions } from "../data";
import { VerticalPadder } from "../component/styled";
import { ResponsiveImageContainer, ScrollTopOnMount } from "../component";

// 180 / 250
const ProviderImageRatio = styled(ResponsiveImageContainer)`
	padding-bottom: 72%;
`;

function filterLiveCasinoProviders(providerId) {
  const { sections } = providerDefinitions[providerId];

  return Array.isArray(sections) && sections.indexOf("liveCasino") !== -1;
}

const liveCasinoProviders = Object.keys(providerDefinitions).filter(
  filterLiveCasinoProviders
);

class LiveCasino extends React.Component {
  render() {
    let content = null;
    const { providerId } = this.props.match.params;

    if (providerId) {
      content = <Provider providerId={providerId} />;
    } else {
      content = <List />;
    }

    return (
      <>
        <ScrollTopOnMount />
        <VerticalPadder>
          <ApiContentLoader
            type="livecasino-hero_slider"
            component={ApiCarousel}
          />
        </VerticalPadder>
        <VerticalPadder>{content}</VerticalPadder>
        <VerticalPadder>
          <ApiContentLoader
            type="livecasino-seo"
            component={ApiSeoContent}
            setMeta
            canonicalUrl="live-casino"
          />
        </VerticalPadder>
      </>
    );
  }
}

class Provider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      provider: undefined,
      providerId: undefined,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let newState = null;
    const { providerId } = props;

    if (state.provider === undefined || providerId !== state.providerId) {
      let provider = null;

      if (liveCasinoProviders.indexOf(providerId) !== -1) {
        provider = providerDefinitions[providerId];
      }

      newState = {
        provider,
        providerId,
      };
    }

    return newState;
  }

  render() {
    const { provider, providerId } = this.state;

    if (provider === null) {
      return (
        <Typography variant="h5" component="p">
          Specified provider doesn't exist
        </Typography>
      );
    }

    return (
      <>
        <Grid container justify="flex-start" alignItems="center" spacing={24}>
          <Grid item>
            <IconButton component={Link} to="/live-casino">
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="p">
              Live casino
            </Typography>
          </Grid>
        </Grid>
        <VerticalPadder>
          <OpenGameFromList providers={providerId} categories="livecasino" />
        </VerticalPadder>
      </>
    );
  }
}

class List extends React.PureComponent {
  render() {
    return (
      <>
        <Typography variant="h5" component="p" gutterBottom>
          Live Casino Providers
        </Typography>
        <Grid container justify="center" spacing={16}>
          {liveCasinoProviders.map((providerId) => {
            const provider = providerDefinitions[providerId];

            return (
              <Grid item key={providerId}>
                <ProviderImageWrapper>
                  <ProviderImageRatio>
                    <img src={provider.images.list} alt="" />
                  </ProviderImageRatio>
                  <ActionWrapper align="center">
                    <Button
                      color="primary"
                      variant="contained"
                      component={Link}
                      to={`/live-casino/${providerId}`}
                    >
                      Play
                    </Button>
                  </ActionWrapper>
                </ProviderImageWrapper>
                <Typography variant="h5" component="p" noWrap>
                  {provider.name}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </>
    );
  }
}

const ProviderImageWrapper = styled.div`
	width: 250px;
	position: relative;
	font-size: 0;

	& img {
		width: 250px;
		height: 180px;
		border-radius: ${(p) => p.theme.spacing(2)}px;
	}
`;

const ActionWrapper = styled(Typography)`
	position: absolute;
	top: auto;
	bottom: ${(p) => p.theme.spacing(2)}px;
	width: 100%;
`;

export default LiveCasino;
