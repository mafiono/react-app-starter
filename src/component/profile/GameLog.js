import React from "react";
import styled from "styled-components/macro";
import { startOfWeek, format } from "date-fns";
import { Grid, Typography, Paper, Button } from "@material-ui/core";
import axios from "axios";

import { apiFetch, formatCurrency } from "../../util";
import { DateField } from "../../component/inputs";
import { Spacer } from "../../component/styled";
import LoadingIndicator from "../LoadingIndicator";
import Table from "../data/Table";
import { subscribeTo, PlayerContainer } from "../../state";
import { GameLogEntry } from "../../models/api";

function stopEvent(ev) {
  ev.stopPropagation();
}

class GameLog extends React.PureComponent {
  player;
  constructor(props) {
    super(props);

    const now = new Date();

    this.state = {
      log: undefined,
      from: startOfWeek(now),
      to: now,
      perPage: 10,
      pageIndex: 0,
    };

    const { player } = this.props.player.state;
    this.tableCells = [
      {
        property: "timeStamp",
        label: "Time",
        format: (v) => format(v, "MMMM do yyyy HH:mm:ss"),
      },
      {
        property: "game",
        label: "Game",
      },
      {
        property: "credit",
        label: "Credit",
        format: (v) => player.currencySymbol + " " + formatCurrency(v),
        alignRight: true,
      },
      {
        property: "debit",
        label: "Debit",
        format: (v) => player.currencySymbol + " " + formatCurrency(v),
        alignRight: true,
      },
      {
        property: "balance",
        label: "Balance",
        format: (v) => player.currencySymbol + " " + formatCurrency(v),
        alignRight: true,
      },
      {
        property: "roundId",
        label: "Round Id",
      },
      {
        property: "provider",
        label: "Provider",
      },
      {
        property: "detailsUrl",
        label: "",
        format: (v) => (
          <Button
            variant="contained"
            size="small"
            component="a"
            target="_blank"
            href={process.env.REACT_APP_API_SITE_ROOT + v}
          >
            Details
          </Button>
        ),
      },
    ];
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps, prevState) {
    const { from, to } = this.state;

    if (prevState.from !== from || prevState.to !== to) {
      this.fetch();
    }
  }

  render() {
    const { from, to } = this.state;

    return (
      <>
        <FilterPaper>
          <Grid
            container
            spacing={16}
            justify="space-around"
            onClick={stopEvent}
          >
            <Grid item xs={12} sm={12} md>
              <DateField
                value={from}
                label="From"
                onChange={this.handleStateChange("from")}
              />
            </Grid>
            <Grid item xs={12} sm={12} md>
              <DateField
                value={to}
                label="To"
                onChange={this.handleStateChange("to")}
              />
            </Grid>
          </Grid>
        </FilterPaper>
        {this.renderContent()}
      </>
    );
  }

  renderContent() {
    const { log } = this.state;

    if (log === undefined) {
      return (
        <Spacer>
          <LoadingIndicator />
        </Spacer>
      );
    }

    if (!Array.isArray(log) || log.length === 0) {
      return (
        <Spacer>
          <Typography variant="subtitle1" component="p" color="textSecondary">
            No game log data to show...
          </Typography>
        </Spacer>
      );
    }

    const { pageIndex, perPage } = this.state;

    return (
      <Table
        cells={this.tableCells}
        data={log}
        page={pageIndex}
        rowsPerPage={perPage}
        onChangePage={this.handleStateChange("pageIndex")}
        onChangeRowsPerPage={this.handleStateChange("perPage")}
      />
    );
  }

  handleStateChange = (prop, callback) => (value) =>
    this.setState({ [prop]: value }, callback);

  fetch = () => {
    const { player } = this.props.player.state;
    const { from, to } = this.state;

    this.setState({ log: undefined }, () => {
      if (this.requestSource) {
        this.requestSource.cancel();
      }

      this.requestSource = axios.CancelToken.source();

      apiFetch
        .post("/player/gamesHistory", {
          cancelToken: this.requestSource.token,
          data: {
            player_id: player.id,
            limit: 999999,
            offset: 0,
            from: format(from, "YYYY-MM-dd") + " 00:00:00",
            to: format(to, "YYYY-MM-dd") + " 23:59:59",
          },
        })
        .then(this.processFetch)
        .catch(this.handleError);
    });
  };

  processFetch = (response) => {
    this.setState({
      log: null,
    });

    if (
      !response ||
      !response.data ||
      !Array.isArray(response.data.data) ||
      !response.data.info ||
      !response.data.info.success
    ) {
      return;
    }

    const log = [];
    const { data } = response.data;

    for (const item of data) {
      log.push(new GameLogEntry(item));
    }

    this.setState({
      log,
    });
  };

  handleError = (error) => {
    this.setState({ log: null });

    if (this._unmounted || axios.isCancel(error)) {
      return;
    }

    this.processFetch(error.response);
  };
}

const FilterPaper = styled(Paper)`
	padding: ${(p) => p.theme.spacing(2)}px;
`;

export default subscribeTo(
  {
    player: PlayerContainer,
  },
  GameLog
);
