import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import {
  Tabs,
  Tab,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { providerDefinitions, availableCategories } from "../data";
import { GameList } from "./";

const CustomTabs = styled((props) => (
  <Tabs {...props} classes={{ scrollButtons: "scrollButtons" }} />
))`
	& .scrollButtons {
		color: rgba(255, 255, 255, .5);
		transition: ${(p) => p.theme.createTransition("color", "short")};
	}

	& .scrollButtons:hover {
		color: #fff;
	}
`;

class GamesFilter extends React.PureComponent {
  static propTypes = {
    providers: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: "all",
      selectedProviders: "all",
      listCategoriesCache: ["all"], // TODO check why i can't set multiple categories in the api request
      listProvidersCache: props.providers,
    };
  }

  render() {
    const {
      selectedCategory,
      selectedProviders,
      listProvidersCache,
      listCategoriesCache,
    } = this.state;
    const { providers, categories } = this.props;

    let selectedProviderText = "All";

    if (selectedProviders !== "all" && selectedProviders.length > 0) {
      if (selectedProviders.length === 1) {
        selectedProviderText = providerDefinitions[selectedProviders[0]].name;
      } else {
        selectedProviderText = selectedProviders.length + " selected";
      }
    }

    return (
      <MainWrapper key="wrapper">
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Providers: {selectedProviderText}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ display: "block" }}>
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  onChange={this.handleProviderChange("all")}
                  checked={selectedProviders === "all"}
                  value="all"
                />
              }
              label="All"
            />
            <Divider />
            <StyledFormGroup row>
              {providers.map(this.renderProvider)}
            </StyledFormGroup>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <CustomTabs
          value={selectedCategory}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab key="all" value="all" label="All" />
          {categories.map(this.renderCategory)}
        </CustomTabs>
        <GameList
          providers={listProvidersCache}
          categories={listCategoriesCache}
        />
      </MainWrapper>
    );
  }

  renderCategory = (value) => {
    return (
      <Tab key={value} value={value} label={availableCategories[value].name} />
    );
  };

  renderProvider = (value) => {
    const { selectedProviders } = this.state;

    if (!providerDefinitions[value]) {
      return null;
    }

    return (
      <FormControlLabel
        key={value}
        control={
          <Switch
            color="primary"
            checked={
              selectedProviders === "all" ||
              selectedProviders.indexOf(value) !== -1
            }
            onChange={this.handleProviderChange(value)}
            value={value}
          />
        }
        label={providerDefinitions[value].name}
        style={{ marginRight: "3em" }}
      />
    );
  };

  handleTabChange = (ev, selectedCategory) => {
    this.setState({
      selectedCategory,
      listCategoriesCache: [selectedCategory],
    });
  };

  handleProviderChange = (provider) => (ev, checked) => {
    let newSelectedProviders = "all";
    const { selectedProviders } = this.state;

    if (provider !== "all") {
      const { providers } = this.props;

      if (checked) {
        newSelectedProviders =
          selectedProviders === "all" ? [] : selectedProviders.slice();

        if (newSelectedProviders.indexOf(provider) === -1) {
          newSelectedProviders.push(provider);
        }

        if (newSelectedProviders.length === providers.length) {
          newSelectedProviders = "all";
        }
      } else {
        if (
          selectedProviders === "all" ||
          (Array.isArray(selectedProviders) && selectedProviders.length === 0)
        ) {
          newSelectedProviders = [provider];
        } else {
          newSelectedProviders =
            selectedProviders === "all"
              ? providers.slice()
              : selectedProviders.slice();
          newSelectedProviders = newSelectedProviders.filter(
            (p) => p !== provider
          );
        }
      }
    } else {
      if (!checked) {
        newSelectedProviders = [];
      }
    }

    let listProvidersCache = newSelectedProviders;

    if (
      newSelectedProviders === "all" ||
      (Array.isArray(newSelectedProviders) && newSelectedProviders.length === 0)
    ) {
      listProvidersCache = this.props.providers;
    }

    this.setState({
      listProvidersCache,
      selectedProviders: newSelectedProviders,
    });
  };
}

const MainWrapper = styled.div`
	${(p) => p.theme.mui.breakpoints.down("sm")} {
		margin: ${(p) => p.theme.spacing()}px 0;
	}
`;

const StyledFormGroup = styled(FormGroup)`
	${(p) => p.theme.mui.breakpoints.down("xs")} {
		flex-direction: column;
	}
`;

export default GamesFilter;
