import React from "react";
import qs from "query-string";
import { Typography } from "@material-ui/core";
import { Helmet } from "react-helmet-async";

import { MaxWidth, VerticalPadder } from "../component/styled";
import { ScrollTopOnMount, Search as SearchComponent } from "../component";
import { canonicalize } from "../util";

class Search extends React.PureComponent {
  render() {
    const { search } = this.props.location;

    const searchQuery = qs.parse(search).q || "";
    const canonicalUrl = searchQuery
      ? `/search?q=${encodeURIComponent(searchQuery)}`
      : "/search";

    return (
      <MaxWidth>
        <Helmet>
          <title>
            {searchQuery
              ? `Search results for '${searchQuery}'`
              : "Search BetBTC.io"}
          </title>
          <link rel="canonical" href={canonicalize(canonicalUrl)} />
        </Helmet>
        <ScrollTopOnMount />
        <VerticalPadder>
          <Typography variant="h6" component="h1">
            Search games
          </Typography>
          <SearchComponent query={searchQuery} onSearch={this.handleSearch} />
        </VerticalPadder>
      </MaxWidth>
    );
  }

  handleSearch = (query) => {
    const { history } = this.props;

    history.push("/search?q=" + encodeURIComponent(query));
  };
}

export default Search;
