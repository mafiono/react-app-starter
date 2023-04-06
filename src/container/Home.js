import React from "react";
import Helmet from "react-helmet-async";
import { Typography } from "@material-ui/core";

import {
  PromoCarousel,
  ApiCarousel,
  ApiContentLoader,
  ApiSeoContent,
  ApiGamesLoader,
} from "../component/api";
import { VerticalPadder } from "../component/styled";
import { GameGrid, ScrollTopOnMount } from "../component";
import { casinoProviderKeys } from "../data";

function randomSelection(data) {
  const numOfItems = 10;

  if (data.length <= numOfItems) {
    return data;
  }

  const selectedIndexes = [];
  const output = [];
  let control = 0;

  while (selectedIndexes.length < numOfItems) {
    if (control > 200) {
      break;
    }

    control++;
    const newIndex = Math.floor(Math.random() * data.length);

    if (selectedIndexes.indexOf(newIndex) !== -1) {
      continue;
    }

    selectedIndexes.push(newIndex);
    output.push(data[newIndex]);
  }

  return output;
}

const providerKeysString = casinoProviderKeys.join(",");

const Home = () => (
  <>
    <Helmet>
      <link rel="canonical" href={process.env.REACT_APP_CANONICAL_BASE_URL} />
    </Helmet>
    <ScrollTopOnMount />
    <VerticalPadder>
      <ApiContentLoader type="home-hero_slider" component={ApiCarousel} />
    </VerticalPadder>
    <VerticalPadder>
      <ApiContentLoader
        type="promotions_slider"
        component={PromoCarousel}
        showContentTitle
      />
    </VerticalPadder>
    <VerticalPadder>
      <Typography variant="h6" color="primary" component="p" gutterBottom>
        Most played games
      </Typography>
      <ApiGamesLoader
        endpoint="/games/mostPlayed/all/50"
        filter={randomSelection}
      >
        {(games, loading) => <GameGrid games={games} loading={loading} />}
      </ApiGamesLoader>
    </VerticalPadder>
    <VerticalPadder>
      <Typography variant="h6" color="primary" component="p" gutterBottom>
        New games
      </Typography>
      <ApiGamesLoader
        endpoint={`games/filter/new/${providerKeysString}/nosort/100/0`}
        filter={randomSelection}
      >
        {(games, loading) => <GameGrid games={games} loading={loading} />}
      </ApiGamesLoader>
    </VerticalPadder>
    <VerticalPadder>
      <Typography variant="h6" color="primary" component="p" gutterBottom>
        Jackpot games
      </Typography>
      <ApiGamesLoader
        endpoint={`games/filter/jackpot/${providerKeysString}/nosort/100/0`}
        filter={randomSelection}
      >
        {(games, loading) => <GameGrid games={games} loading={loading} />}
      </ApiGamesLoader>
    </VerticalPadder>
    <VerticalPadder>
      <ApiContentLoader type="home-seo" component={ApiSeoContent} setMeta />
    </VerticalPadder>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "16px",
      }}
    >
      <iframe
        src="https://deadsimplechat.com/67Xra3wz_" title="Online Chat"
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "400px",
          margin: "0 auto",
          border: 0,
        }}
      />
    </div>
  </>
);

export default Home;
