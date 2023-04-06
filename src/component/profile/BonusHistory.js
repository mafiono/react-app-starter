import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { format } from "date-fns";
import {
  Typography,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
} from "@material-ui/core";
import axios from "axios";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoIcon from "@material-ui/icons/Info";

import { apiFetch, formatCurrency } from "../../util";
import {
  subscribeTo,
  PlayerContainer,
  PlayerBalanceContainer,
} from "../../state";
import { LoadingIndicator } from "..";
import { VerticalPadder, MaxWidth } from "../styled";
import Table from "../data/Table";
import {
  BonusHistory as BonusHistoryModel,
  processHistoryResponse,
} from "../../models/api";

const BonusHistoryDetailsCell = React.memo(
  ({ children, alignRight, strong }) => {
    return (
      <Grid item xs={6}>
        <Typography
          variant="caption"
          component="p"
          align={alignRight ? "right" : undefined}
        >
          {strong ? <strong>{children}</strong> : children}
        </Typography>
      </Grid>
    );
  }
);

const BonusHistoryWagers = React.memo(
  ({ expanded, onToggle, children, wagers, total }) => {
    const cells = [
      {
        property: "provider",
        label: "Game Group",
        style: { width: "40%" },
      },
      {
        property: "amount",
        label: "Wager",
        format: (v) => formatCurrency(v),
        alignRight: true,
      },
      {
        property: "percentage",
        label: "Contribution (%)",
        format: (v) => v + "%",
        alignRight: true,
      },
      {
        property: "contribution",
        label: "Point contribution",
        format: (v) => formatCurrency(v),
        alignRight: true,
      },
    ];

    return (
      <ExpansionPanel expanded={expanded} onChange={onToggle}>
        <ExpansionPanelSummary expandIcon={<InfoIcon />}>
          {children}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TableWrapper>
            <Table
              cells={cells}
              data={wagers}
              page={0}
              rowsPerPage={100}
              uniqueKeyProperty="provider"
              hidePagination
            />
            <VerticalPadder bottom={0}>
              <Typography align="right" component="p">
                Total wager: <strong>{total}</strong>
              </Typography>
            </VerticalPadder>
          </TableWrapper>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
);

const TableWrapper = styled.div`
	width: 100%;

	& > {
		width: 100%;
	}
`;

class BonusHistoryItem extends React.PureComponent {
  static propTypes = {
    initiallyOpen: PropTypes.bool,
    bonusHistory: PropTypes.instanceOf(BonusHistoryModel).isRequired,
  };

  static defaultProps = {
    initiallyOpen: false,
  };

  state = {
    expanded: undefined,
    showWagers: false,
  };

  static getDerivedStateFromProps(props, state) {
    let newState = null;

    if (state.expanded === undefined) {
      newState = {
        expanded: props.initiallyOpen,
      };
    }

    return newState;
  }

  render() {
    const { expanded } = this.state;
    const { bonusHistory, player, children } = this.props;
    const {
      bonusMeta,
      playerMessage,
      active,
      depositAmount,
      validUntil,
      contributionTotal,
      pointsNeeded,
      issuedOn,
      finishedOn,
      bonusAmount,
    } = bonusHistory;
    const { currencySymbol } = player;

    let ExpansionComponent = active ? HistoryItemWrapper : ExpansionPanel;

    return (
      <ExpansionComponent expanded={expanded} onChange={this.handleMainToggle}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <HistorySummaryWrapper>
            <Typography
              className="title"
              variant="subtitle1"
              component="p"
              noWrap
            >
              {bonusMeta.name}
            </Typography>
            <Typography className="other" variant="caption" component="p">
              Code: <strong>{bonusMeta.code}</strong>
            </Typography>
          </HistorySummaryWrapper>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <BonusHistoryDetailsWrapper>
            <Divider />
            {active ? this.renderActiveDetails() : this.renderHistoryDetails()}
            {children}
            {playerMessage && (
              <MaxWidth>
                <VerticalPadder>
                  <Typography component="p" variant="caption" paragraph>
                    {playerMessage}
                  </Typography>
                </VerticalPadder>
              </MaxWidth>
            )}
            <Grid container justify="flex-start">
              <BonusHistoryDetailsColumn
                container
                item
                xs={12}
                sm={6}
                md={4}
                spacing={8}
                alignItems="center"
              >
                <BonusHistoryDetailsCell alignRight>
                  Start time:
                </BonusHistoryDetailsCell>
                <BonusHistoryDetailsCell strong>
                  {format(issuedOn, "dd. MM. YYYY HH:mm:ss")}
                </BonusHistoryDetailsCell>
                {active ? (
                  <>
                    <BonusHistoryDetailsCell alignRight>
                      Expiration time:
                    </BonusHistoryDetailsCell>
                    <BonusHistoryDetailsCell strong>
                      {format(validUntil, "dd. MM. YYYY HH:mm:ss")}
                    </BonusHistoryDetailsCell>
                  </>
                ) : (
                  <>
                    <BonusHistoryDetailsCell alignRight>
                      End time:
                    </BonusHistoryDetailsCell>
                    <BonusHistoryDetailsCell strong>
                      {format(finishedOn, "dd. MM. YYYY HH:mm:ss")}
                    </BonusHistoryDetailsCell>
                  </>
                )}
                <BonusHistoryDetailsCell alignRight>
                  Points needed:
                </BonusHistoryDetailsCell>
                <BonusHistoryDetailsCell strong>
                  {pointsNeeded}
                </BonusHistoryDetailsCell>
              </BonusHistoryDetailsColumn>
              <BonusHistoryDetailsColumn
                container
                item
                xs={12}
                sm={6}
                md={4}
                spacing={8}
                alignItems="center"
              >
                <BonusHistoryDetailsCell alignRight>
                  Deposit:
                </BonusHistoryDetailsCell>
                <BonusHistoryDetailsCell strong>
                  {currencySymbol} {formatCurrency(depositAmount)}
                </BonusHistoryDetailsCell>
                <BonusHistoryDetailsCell alignRight>
                  Bonus:
                </BonusHistoryDetailsCell>
                <BonusHistoryDetailsCell strong>
                  {currencySymbol} {formatCurrency(bonusAmount)}
                </BonusHistoryDetailsCell>
                <BonusHistoryDetailsCell alignRight>
                  Points gained:
                </BonusHistoryDetailsCell>
                <BonusHistoryDetailsCell strong>
                  {contributionTotal}
                </BonusHistoryDetailsCell>
              </BonusHistoryDetailsColumn>
              <BonusHistoryDetailsColumn
                container
                item
                xs={12}
                sm={6}
                md={4}
                spacing={8}
                alignItems="center"
              >
                <BonusHistoryDetailsCell alignRight>
                  Wagering requirement:
                </BonusHistoryDetailsCell>
                <BonusHistoryDetailsCell strong>
                  X {bonusMeta.wageringRequirement}
                </BonusHistoryDetailsCell>
              </BonusHistoryDetailsColumn>
            </Grid>
          </BonusHistoryDetailsWrapper>
        </ExpansionPanelDetails>
      </ExpansionComponent>
    );
  }

  renderActiveDetails() {
    const { clearedPercentage, wagers, contributionTotal } =
      this.props.bonusHistory;

    const { showWagers } = this.state;

    return (
      <>
        <MaxWidth>
          <BonusHistoryWagers
            expanded={showWagers}
            onToggle={this.handleWagersToggle}
            wagers={wagers}
            total={contributionTotal}
          >
            <ActiveWagersWrapper>
              <ClearedPercentageWrapper>
                <Percentage percent={clearedPercentage} />
                <Typography component="p" align="center">
                  Bonus cleared:{" "}
                  <strong>{formatCurrency(clearedPercentage)}%</strong>
                </Typography>
              </ClearedPercentageWrapper>
            </ActiveWagersWrapper>
          </BonusHistoryWagers>
        </MaxWidth>
      </>
    );
  }

  renderHistoryDetails() {
    const { wagers, contributionTotal } = this.props.bonusHistory;

    const { showWagers } = this.state;

    return (
      <MaxWidth>
        <BonusHistoryWagers
          expanded={showWagers}
          onToggle={this.handleWagersToggle}
          wagers={wagers}
          total={contributionTotal}
        />
      </MaxWidth>
    );
  }

  handleMainToggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleWagersToggle = () => {
    this.setState({ showWagers: !this.state.showWagers });
  };
}

const ActiveWagersWrapper = styled.div`
	width: 100%;
`;

const ClearedPercentageWrapper = styled.div`
	width: 100%;
	overflow: hidden;
	position: relative;
	border-radius: ${(p) => p.theme.spacing(0.5)}px;
	background: ${(p) => p.theme.mui.palette.background.default};
	padding: ${(p) => p.theme.spacing(0.5)}px;

	& > p {
		position: relative;
	}
`;

const Percentage = styled.div`
	width: ${(p) => p.percent}%;
	height: 100%;
	background: #4d774d;
	position: absolute;
	top: 0;
	left: 0;
`;

const BonusHistoryDetailsWrapper = styled.div`
	width: 100%;
`;

const BonusHistoryDetailsColumn = styled(Grid)`
	padding: ${(p) => p.theme.spacing(0.5)}px 0;
`;

const HistoryItemWrapper = styled(ExpansionPanel)`
	box-shadow: 0 0 2px #0f0;
`;

const HistorySummaryWrapper = styled.div`
	${(p) => p.theme.mui.breakpoints.up("sm")} {
		display: flex;
		width: 100%;
		align-items: center;

		& .title {
			padding-right: ${(p) => p.theme.spacing()}px;
			width: 45%;
			max-width: ${(p) => p.theme.spacing(50)}px;
			flex-grow: 0;
			flex-shrink: 1;
		}

		& .other {
			width: auto;
			flex-grow: 1;
			flex-shrink: 0;
		}
	}
`;

class BonusHistory extends React.PureComponent {
  static propTypes = {
    perPage: PropTypes.number,
  };

  static defaultProps = {
    perPage: 10,
  };

  state = {
    activeBonus: undefined,
    history: undefined,
    loading: true,
    page: 0,
    selectedItem: null,
  };

  requestSource = null;

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps, prevState) {
    const { perPage } = this.props;
    const { perPage: prevPerPage } = prevProps;
    const { page, loading } = this.state;
    const { page: prevPage } = prevState;

    if (perPage !== prevPerPage) {
      this.setState({ page: 0, loading: true }, this.load);
    } else if (page !== prevPage && !loading) {
      this.load();
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { loading } = this.state;

    return (
      <LoadingIndicator loadingMessage="Loading history..." active={loading}>
        {this.renderContent()}
      </LoadingIndicator>
    );
  }

  renderContent() {
    const { activeBonus, history } = this.state;

    if (!Array.isArray(history) && !activeBonus) {
      return null;
    }

    return (
      <>
        {activeBonus && (
          <VerticalPadder>
            <Typography
              key="activeBonusTitle"
              variant="subtitle1"
              component="p"
              gutterBottom
            >
              Active bonus
            </Typography>
            <BonusHistoryItem
              key="activeBonus"
              initiallyOpen
              bonusHistory={activeBonus}
              player={this.props.player.state.player}
            >
              <VerticalPadder>
                <Typography
                  variant="subtitle1"
                  align="center"
                  component="p"
                  paragraph
                >
                  Bonus balance: <strong>{this.getCurrentBonusText()}</strong>
                </Typography>
              </VerticalPadder>
            </BonusHistoryItem>
          </VerticalPadder>
        )}
        {Array.isArray(history) && (
          <VerticalPadder>
            <Typography variant="subtitle1" component="p" gutterBottom>
              Bonus history
            </Typography>
            {history.map(this.renderItem)}
          </VerticalPadder>
        )}
      </>
    );
  }

  getCurrentBonusText() {
    const {
      playerBalance,
      player: {
        state: { player },
      },
    } = this.props;

    if (!playerBalance || !player) {
      return null;
    }

    const { currencySymbol } = player;

    if (playerBalance.loading()) {
      return "loading...";
    }

    if (!playerBalance.valuesLoaded()) {
      return "error while fetching data";
    }

    if (!playerBalance.hasBonus()) {
      return "no bonus";
    }

    return `${currencySymbol} ${formatCurrency(playerBalance.state.bonus)}`;
  }

  renderItem = (item) => {
    return (
      <BonusHistoryItem
        key={item.id}
        bonusHistory={item}
        player={this.props.player.state.player}
      />
    );
  };

  load = () => {
    this.setState(
      {
        loading: true,
      },
      this.fetch
    );
  };

  fetch = () => {
    const { perPage, player: playerContainer } = this.props;
    const { page } = this.state;
    const { player } = playerContainer.state;

    if (this.requestSource) {
      this.requestSource.cancel();
    }

    this.requestSource = axios.CancelToken.source();

    apiFetch
      .post("player/bonusHistory", {
        data: {
          player_id: player.id,
          limit: perPage,
          offset: page * perPage,
        },
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  };

  handleResponse = (response) => {
    if (this._unmounted) {
      return;
    }

    if (response && response.data && response.data.data) {
      const { activeBonus, bonusHistory } = response.data.data;

      if (activeBonus) {
        this.setState({ activeBonus: new BonusHistoryModel(activeBonus) });
      }

      if (Array.isArray(bonusHistory)) {
        let { history, page } = this.state;
        history = page > 0 && Array.isArray(history) ? history.slice(0) : [];

        history = [...history, ...processHistoryResponse(bonusHistory)];

        this.setState({ history });
      }
    }

    this.setState({
      loading: false,
    });
  };

  handleError = (error) => {
    if (this._unmounted || axios.isCancel(error)) {
      return;
    }

    this.handleResponse(error.response);
  };

  incrementPage = () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
  };
}

export default subscribeTo(
  {
    player: PlayerContainer,
    playerBalance: PlayerBalanceContainer,
  },
  BonusHistory
);
