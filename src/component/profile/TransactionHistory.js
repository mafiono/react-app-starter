import React from "react";
import styled from "styled-components/macro";
import { startOfWeek, format } from "date-fns";
import {
  Grid,
  Typography,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Tabs,
  Tab,
  Paper,
  Button,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import { apiFetch, formatCurrency } from "../../util";
import { DateField } from "../../component/inputs";
import { Spacer, VerticalPadder } from "../../component/styled";
import LoadingIndicator from "../LoadingIndicator";
import Table from "../data/Table";
import { subscribeTo, PlayerContainer } from "../../state";

const StyledAddIcon = styled(AddIcon)`
	fill: #bce27b;
`;

const StyledRemoveIcon = styled(RemoveIcon)`
	fill: ${(p) => p.theme.mui.palette.error.light};
`;

class TransactionHistory extends React.PureComponent {
  constructor(props) {
    super(props);

    const now = new Date();

    this.state = {
      transactions: undefined,
      loading: true,
      from: startOfWeek(now),
      to: now,
      perPage: 10,
      pageIndex: 0,
      filterType: "",
      filterStatus: "",
      filterMethod: "",
      paymentMethods: [],
      order: "",
      orderBy: "",
    };

    const { player } = this.props.player.state;
    this.tableCells = [
      {
        property: "type",
        sortable: true,
        format: (type) =>
          type === "deposit" ? <StyledAddIcon /> : <StyledRemoveIcon />,
        disablePadding: true,
        alignRight: true,
        style: { width: 35 },
      },
      {
        property: "date_request",
        label: "Date Requested",
        sortable: true,
        format: (v) => format(v, "do MMMM YYYY HH:mm"),
      },
      {
        property: "amount",
        label: "Amount",
        sortable: true,
        format: (v, row) => {
          return (
            (row.type === "deposit" ? "+ " : "- ") +
            player.currencySymbol +
            " " +
            formatCurrency(v)
          );
        },
        alignRight: true,
      },
      {
        property: "status",
        label: "Status",
        sortable: true,
        format: (status) => {
          const props = {
            color: "default",
          };

          switch (status) {
            case "CANCELLED":
              props.color = "error";
              break;

            case "PROCESSED":
              props.color = "primary";
              break;

            default:
          }

          return (
            <Typography variant="caption" {...props}>
              {status.toLowerCase()}
            </Typography>
          );
        },
        alignRight: true,
      },
      {
        property: "action",
        label: "Action",
        sortable: false,
        format: (noop, { id }) => {
          const { pendingWdIds, paymentWithdrawals } = this.props;

          if (pendingWdIds.indexOf(id) === -1) {
            return null;
          }

          return (
            <Button
              onClick={() => {
                apiFetch
                  .post("player/transactions/pendingWithdrawals/cancel", {
                    data: {
                      trans_ids: [id],
                    },
                  })
                  .then(() => {
                    if (!paymentWithdrawals.loading()) {
                      paymentWithdrawals.fetch(true);
                    }

                    this.fetch();
                  });
              }}
            >
              Cancel
            </Button>
          );
        },
        alignRight: true,
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
    const { from, to, paymentMethods, filterMethod, filterType, filterStatus } =
      this.state;

    return (
      <VerticalPadder>
        <Paper elevation={0}>
          <Tabs
            value="all"
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
          >
            <Tab value="all" label="All" />
            <Tab value="pending-wd" label="Pending WD" />
          </Tabs>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Grid
                container
                spacing={8}
                justify="space-around"
                onClick={(ev) => ev.stopPropagation()}
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
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid
                container
                spacing={8}
                justify="space-around"
                onClick={(ev) => ev.stopPropagation()}
              >
                <Grid item xs={12} sm={6} md>
                  <TextField
                    label="Type"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    value={filterType}
                    onChange={this.handleFilterChange("filterType")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <option value="">-</option>
                    <option value="deposit">deposit</option>
                    <option value="withdraw">withdraw</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md>
                  <TextField
                    label="Status"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    value={filterStatus}
                    onChange={this.handleFilterChange("filterStatus")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <option value="">-</option>
                    <option value="pending">pending</option>
                    <option value="processed">processed</option>
                    <option value="failed">failed</option>
                    <option value="cancelled">cancelled</option>
                    <option value="error">error</option>
                    <option value="denied">denied</option>
                    <option value="in progress">in progress</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md>
                  <TextField
                    label="Payment methods"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    value={filterMethod}
                    onChange={this.handleFilterChange("filterMethod")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  >
                    <option value="">-</option>
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {this.renderContent()}
        </Paper>
      </VerticalPadder>
    );
  }

  renderContent() {
    const { loading } = this.state;

    if (loading) {
      return (
        <Spacer>
          <LoadingIndicator />
        </Spacer>
      );
    }

    const {
      pageIndex,
      perPage,
      filterType,
      filterStatus,
      filterMethod,
      transactions,
      order,
      orderBy,
    } = this.state;

    let filteredTransactions = [];

    if (Array.isArray(transactions)) {
      filteredTransactions = transactions;

      if (filterType) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.type === filterType
        );
      }

      if (filterStatus) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.status.toLowerCase() === filterStatus
        );
      }

      if (filterMethod) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.method === filterMethod
        );
      }
    }

    if (filteredTransactions.length === 0) {
      return (
        <Spacer>
          <Typography variant="subtitle1" color="textSecondary">
            You have no registered transactions for the set period
          </Typography>
        </Spacer>
      );
    }

    if (orderBy) {
      filteredTransactions = filteredTransactions.sort((a, b) => {
        let aValue = a[orderBy];
        let bValue = b[orderBy];

        let sortRes = 0;

        if (aValue > bValue) {
          sortRes = -1;
        } else if (aValue < bValue) {
          sortRes = 1;
        }

        if (order === "asc") {
          if (sortRes === -1) {
            sortRes = 1;
          } else if (sortRes === 1) {
            sortRes = -1;
          }
        }

        if (sortRes === 0) {
          if (orderBy !== "date_request") {
            let aValue = a.date_request;
            let bValue = b.date_request;

            if (aValue > bValue) {
              sortRes = -1;
            }

            if (aValue < bValue) {
              sortRes = 1;
            }
          }
        }

        return sortRes;
      });
    }

    return (
      <Table
        cells={this.tableCells}
        data={filteredTransactions}
        page={pageIndex}
        rowsPerPage={perPage}
        onChangePage={this.handleStateChange("pageIndex")}
        onChangeRowsPerPage={this.handleStateChange("perPage")}
        onRequestSort={this.handleSort}
      />
    );
  }

  handleStateChange = (prop, callback) => (value) =>
    this.setState({ [prop]: value }, callback);

  handleFilterChange = (prop) => (ev) =>
    this.setState({ [prop]: ev.target.value });

  fetch = () => {
    const { player } = this.props.player.state;
    const { from, to } = this.state;

    this.setState({ loading: true }, () => {
      apiFetch
        .post("player/transactions", {
          data: {
            player_id: player.id,
            limit: 999999,
            filters: {
              offset: 0,
              date_request_from: format(from, "YYYY-MM-dd") + " 00:00:00",
              date_request_to: format(to, "YYYY-MM-dd") + " 23:59:59",
            },
          },
        })
        .then(this.processFetch(from, to))
        .catch((error) => this.processFetch(from, to)(error.response));
    });
  };

  processFetch = (originalFrom, originalTo) => (response) => {
    const { from, to } = this.state;

    if (originalFrom !== from || originalTo !== to) {
      return;
    }

    this.setState({
      transactions: undefined,
      loading: false,
    });

    if (
      !response ||
      !response.data ||
      !response.data.data ||
      !response.data.info ||
      !response.data.info.success
    ) {
      return;
    }

    const { total, transactions: responseTransactions } = response.data.data;

    if (typeof total !== "number") {
      // TODO sentry error unexpected transaction history response
      return;
    }

    let transactions = responseTransactions;
    if (total === 0) {
      transactions = [];
    }

    const paymentMethods = [];

    transactions.forEach((t) => {
      const method = t.method;

      if (paymentMethods.indexOf(method) === -1) {
        paymentMethods.push(method);
      }
    });

    let { filterMethod } = this.state;

    if (paymentMethods.indexOf(filterMethod) === -1) {
      filterMethod = "";
    }

    this.setState({ transactions, paymentMethods, filterMethod });
  };

  handleSort = (property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };
}

export default subscribeTo(
  {
    player: PlayerContainer,
  },
  TransactionHistory
);
