import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import Helmet from "react-helmet-async";

import { ApiContent } from ".";
import { LoadingIndicator } from "../";
import { apiFetch, sortByPosition, canonicalize } from "../../util";
import { ApiContent as ApiContentModel } from "../../models/api";

const responseCache = {};

function getCachedResponse(type) {
  if (!type || !responseCache.hasOwnProperty(type)) {
    return undefined;
  }

  return responseCache[type];
}

function Content({ content }) {
  if (!content.content) {
    return null;
  }

  return <ApiContent>{content.content}</ApiContent>;
}

class ApiContentLoader extends React.PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    showContentTitle: PropTypes.bool,
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.object,
    ]),
    contentTitleComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.object,
    ]),
    sortBy: PropTypes.func,
    setMeta: PropTypes.bool,
    canonicalUrl: PropTypes.string,
  };

  static defaultProps = {
    showContentTitle: false,
    component: Content,
    sortBy: sortByPosition,
    setMeta: false,
    contentTitleComponent: "p",
  };

  state = {
    response: undefined,
    lastType: null,
  };

  static getDerivedStateFromProps(props, state) {
    let returnedState = null;
    const { type, staticContext } = props;
    const { lastType } = state;

    if (lastType === null || type !== lastType) {
      let response = undefined;

      if (staticContext && staticContext.responses.contentLoader[type]) {
        response = staticContext.responses.contentLoader[type];
      } else {
        response = getCachedResponse(type);
      }

      returnedState = {
        lastType: type,
        response,
      };
    }

    return returnedState;
  }

  constructor(props) {
    super(props);

    this.load(props.type);
  }

  componentDidUpdate() {
    this.load();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { response } = this.state;

    if (response === undefined) {
      return <LoadingIndicator />;
    }

    if (!response) {
      return null;
    }

    const {
      showContentTitle,
      component: Component,
      type,
      setMeta,
      contentTitleComponent,
      canonicalUrl,
      ...rest
    } = this.props;

    return (
      <>
        {setMeta && (
          <Helmet>
            <title>{response.meta.title}</title>
            <meta name="description" content={response.meta.description} />
            {canonicalUrl && (
              <link rel="canonical" href={canonicalize(canonicalUrl)} />
            )}
          </Helmet>
        )}
        {showContentTitle && response.title && (
          <Typography
            variant="h6"
            component={contentTitleComponent}
            color="primary"
            gutterBottom
          >
            {response.title}
          </Typography>
        )}
        <Component
          content={response}
          setMeta={setMeta}
          canonicalUrl={canonicalUrl}
          {...rest}
        />
      </>
    );
  }

  load(forceType) {
    const { lastType, response } = this.state;
    const { staticContext } = this.props;

    if (staticContext && staticContext.secondRun) {
      return;
    }

    if (!forceType && (!lastType || response !== undefined)) {
      return;
    }

    const request = apiFetch("content/type/" + (forceType || lastType))
      .then(this.processResponse)
      .catch((error) => {
        this.processResponse(error.response);
      });

    if (staticContext && staticContext.fetching) {
      staticContext.fetching.push(request);
    }
  }

  processResponse = (requestResponse) => {
    const { lastType } = this.state;
    const { type, sortBy } = this.props;

    if (this._unmounted || lastType !== type || !requestResponse) {
      return;
    }

    let response = null;

    if (
      requestResponse.data &&
      Array.isArray(requestResponse.data.data) &&
      requestResponse.data.data.length > 0
    ) {
      response = new ApiContentModel(requestResponse.data.data[0], {
        sort: sortBy,
      });
    }

    const { staticContext } = this.props;

    if (staticContext && staticContext.responses) {
      staticContext.responses.contentLoader[lastType] = response;
    } else {
      responseCache[lastType] = response;

      this.setState({
        response,
      });
    }
  };
}

export default withRouter(ApiContentLoader);
