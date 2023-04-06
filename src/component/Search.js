import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import {
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";

import { apiFetch, getFormData } from "../util";
import { VerticalPadder } from "./styled";
import { processGamesResponse } from "../models/api";
import { subscribeTo, AppStateContainer } from "../state";
import { GameGrid } from ".";

class Search extends React.PureComponent {
  static propTypes = {
    query: PropTypes.string,
  };

  static defaultProps = {
    query: "",
  };

  state = {
    emptyInput: false,
    searchingGames: false,
    gameResults: undefined,
    newsResults: undefined,
  };

  searchField = React.createRef();

  componentDidMount() {
    this.doSearch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.doSearch();
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { query } = this.props;
    const { emptyInput } = this.state;

    return (
      <>
        <Paper>
          <VerticalPadder left={2} right={2}>
            <SearchForm onSubmit={this.handleSubmit}>
              <TextField
                inputRef={this.searchField}
                defaultValue={query}
                placeholder="Search games"
                name="query"
                helperText={emptyInput ? "Please specify a search term." : ""}
                error={emptyInput}
                variant="outlined"
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
            </SearchForm>
            {this.renderGames()}
          </VerticalPadder>
        </Paper>
      </>
    );
  }

  renderGames() {
    const { gameResults, searchingGames } = this.state;

    if (gameResults === undefined && !searchingGames) {
      return null;
    }

    let content = null;

    if (Array.isArray(gameResults)) {
      content = (
        <VerticalPadder>
          <Typography variant="subtitle1" component="p" align="center">
            Game results
          </Typography>
          <GameGrid games={gameResults} loading={searchingGames} />
        </VerticalPadder>
      );
    } else {
      if (searchingGames) {
        content = (
          <Typography
            key="searching"
            variant="subtitle1"
            component="p"
            align="center"
          >
            Searching for games...
          </Typography>
        );
      } else {
        content = (
          <Typography
            key="failed"
            variant="subtitle1"
            component="p"
            align="center"
          >
            Search failed, please retry.
          </Typography>
        );
      }
    }

    return <VerticalPadder>{content}</VerticalPadder>;
  }

  handleSubmit = (ev) => {
    ev.preventDefault();

    const formData = getFormData(ev.currentTarget);
    const newState = {
      emptyInput: false,
      searchingGames: false,
      newsResults: undefined,
    };

    if (!formData.query) {
      newState.gameResults = undefined;
      newState.emptyInput = true;
    }

    this.setState(newState, () => {
      const { emptyInput } = this.state;

      if (!emptyInput) {
        const { onSearch } = this.props;

        if (onSearch) {
          const { value } = this.searchField.current;
          onSearch(value);
        }
      }
    });
  };

  doSearch = () => {
    if (this.gamesRequestSource) {
      this.gamesRequestSource.cancel();
    }

    this.gamesRequestSource = axios.CancelToken.source();

    const { query } = this.props;

    if (this._unmounted || !query) {
      return;
    }

    this.setState({ searchingGames: true }, () => {
      const encodedValue = encodeURIComponent(query);

      apiFetch(`games/search/${encodedValue}`, {
        cancelToken: this.gamesRequestSource.token,
      })
        .then(this.processGamesResponse)
        .catch((error) => {
          if (axios.isCancel(error)) {
            return;
          }

          this.processGamesResponse(error.response);
        });
    });
  };

  processGamesResponse = (response) => {
    if (this._unmounted) {
      return;
    }

    const newState = {
      gameResults: null,
      searchingGames: false,
    };

    if (
      response &&
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.games)
    ) {
      newState.gameResults = processGamesResponse(
        response.data.data.games,
        this.props.appState.state.isMobile
      );
    }

    this.setState(newState);
  };
}

const SearchForm = styled.form`
	display: flex;
	justify-content: center;
`;

export default subscribeTo(
  {
    appState: AppStateContainer,
  },
  Search
);
