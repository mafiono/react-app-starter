import React from "react";
import {
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { GamesFilter, ScrollTopOnMount } from "../component";
import { VerticalPadder } from "../component/styled";
import { ApiCarousel, ApiContentLoader, ApiSeoContent } from "../component/api";
import { casinoProviderKeys } from "../data";
import { getFormData } from "../util";

const categories = [
  "new",
  "video-slots",
  "table-games",
  "video-poker",
  "jackpot",
  "scratch-cards",
  "video-bingo",
];

class Casino extends React.PureComponent {
  render() {
    return (
      <>
        <ScrollTopOnMount />
        <VerticalPadder>
          <ApiContentLoader type="casino-hero_slider" component={ApiCarousel} />
        </VerticalPadder>
        <VerticalPadder>
          <Grid container spacing={0} justify="space-between">
            <Grid item>
              <Typography variant="h5" component="p" gutterBottom>
                Casino
              </Typography>
            </Grid>
            <Grid item>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  defaultValue=""
                  placeholder="Search games"
                  name="query"
                  helperText={null}
                  variant="standard"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="Start search" type="submit">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </Grid>
          </Grid>
          <GamesFilter providers={casinoProviderKeys} categories={categories} />
        </VerticalPadder>
        <VerticalPadder>
          <ApiContentLoader
            type="casino-seo"
            component={ApiSeoContent}
            setMeta
            canonicalUrl="top-casino"
          />
        </VerticalPadder>
      </>
    );
  }

  handleSubmit = (ev) => {
    ev.preventDefault();

    const { query } = getFormData(ev.target);

    if (!query) {
      return;
    }

    const { history } = this.props;

    history.push(`/search?q=${encodeURIComponent(query)}`);
  };
}

export default Casino;
