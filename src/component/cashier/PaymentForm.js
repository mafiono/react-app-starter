import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components/macro";
import {
  Typography,
  Grid,
  Button,
  TextField,
  Tooltip,
} from "@material-ui/core";

import { Form } from "..";
import { GridContainer, MaxWidth } from "../styled";
import {
  apiFetch,
  processApiFields,
  validatorFromApiFields,
  removeApiFieldScripts,
  inBrowser,
} from "../../util";
import { ApiFormFields } from "../api";

class PaymentForm extends React.PureComponent {
  static externalScriptIndex = 0;

  static propTypes = {
    method: PropTypes.object.isRequired,
    methodType: PropTypes.oneOf(["deposit", "withdrawal"]).isRequired,
    onSubmit: PropTypes.func,
  };

  state = {
    formError: undefined,
    submitting: false,
    wallet: null,
    walletCopyTooltip: false,
    walletCopyTagTooltip: false,
    iframeRedirect: null,
  };

  scripts = [];
  validator = null;

  constructor(props) {
    super(props);

    const { fields } = props.method.form;

    const validator = validatorFromApiFields(fields);
    this.scripts = validator.scripts;
    this.validator = validator.instance;

    this.walletInputRef = React.createRef();
    this.walletTagInputRef = React.createRef();

    window.addEventListener("message", this.messageReceived, false);
  }

  componentWillUnmount() {
    this._unmounted = true;

    removeApiFieldScripts(this.scripts);

    window.removeEventListener("message", this.messageReceived, false);
  }

  messageReceived = (ev) => {
    let json = undefined;

    if (typeof ev.data === "string") {
      try {
        json = JSON.parse(ev.data);
      } catch (ex) {}
    }

    if (json && json.action === "close") {
      this.closeWindow();
    }
  };

  render() {
    const { method } = this.props;
    const { iframeRedirect } = this.state;

    if (iframeRedirect) {
      const { width, height, url, method, parameters } = iframeRedirect;

      return (
        <>
          <iframe
            title="Payment"
            name="redirectTo"
            height={height}
            width={width}
          ></iframe>
          <form
            action={url}
            method={method}
            target="redirectTo"
            ref={(form) => {
              form.submit();
            }}
          >
            {parameters &&
              Object.keys(parameters).map((key) => (
                <input
                  key={key}
                  type="hidden"
                  name={key}
                  value={parameters[key]}
                />
              ))}
          </form>
        </>
      );
    }

    return (
      <MainWrapper>
        <Header>
          <Typography variant="caption" component="p">
            <img
              src={process.env.REACT_APP_API_IMAGE_ROOT + method.image}
              aria-label={method.name}
              alt=""
              width="80"
              height="50"
            />
            <WithAnchor
              component="span"
              dangerouslySetInnerHTML={{ __html: method.text }}
            />
          </Typography>
        </Header>
        {this.renderContent()}
      </MainWrapper>
    );
  }

  renderContent() {
    const { wallet, walletCopyTooltip, walletCopyTagTooltip } = this.state;

    if (wallet) {
      const { message, address, destinationTag } = wallet;

      return (
        <MaxWidth>
          <Typography component="div" align="center" paragraph>
            <img
              alt="QR code"
              src={`https://chart.googleapis.com/chart?cht=qr&chl=${address}&choe=UTF-8&chs=150x150`}
            />
          </Typography>
          <Typography component="div" paragraph align="center">
            {message}
          </Typography>
          <Typography component="div" align="center" paragraph>
            <Tooltip
              open={walletCopyTooltip}
              title="Address copied!"
              aria-label="Address copied!"
              placement="top"
            >
              <AddressField
                label="Address"
                defaultValue={address}
                onClick={this.handleTextFieldClick}
                inputRef={this.walletInputRef}
                InputProps={{
                  classes: {
                    input: "addressInput",
                  },
                  readOnly: true,
                }}
                fullWidth
              />
            </Tooltip>
            <Typography
              component="p"
              align="center"
              variant="caption"
              paragraph
            >
              Please copy the address manually if the button doesn't work.
            </Typography>
          </Typography>
          <Grid container justify="center" spacing={10}>
            <Grid item>
              <Button
                variant="contained"
                onClick={this.addressToClipboard}
                color="primary"
              >
                Copy address
              </Button>
            </Grid>
          </Grid>
          {destinationTag && (
            <>
              <Typography component="div" align="center" paragraph>
                <Tooltip
                  open={walletCopyTagTooltip}
                  title="Destination tag copied!"
                  aria-label="Destination tag copied!"
                  placement="top"
                >
                  <AddressField
                    label="Destination tag"
                    defaultValue={destinationTag}
                    onClick={this.handleTagTextFieldClick}
                    inputRef={this.walletTagInputRef}
                    InputProps={{
                      classes: {
                        input: "addressInput",
                      },
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Tooltip>
                <Typography
                  component="p"
                  align="center"
                  variant="caption"
                  paragraph
                >
                  Please copy the destination tag manually if the button doesn't
                  work.
                </Typography>
              </Typography>
              <Grid container justify="center" spacing={16}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={this.destinationTagToClipboard}
                    color="primary"
                  >
                    Copy destination tag
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          <p>&nbsp;</p>
          <Grid container justify="center" spacing={16}>
            <Grid item>
              <Button
                variant="contained"
                onClick={this.closeWindow}
                color="secondary"
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </MaxWidth>
      );
    }

    const { method, methodType } = this.props;
    const { formError, submitting } = this.state;

    return (
      <Form
        onSubmit={this.handleSubmit}
        validator={this.validator}
        submitting={submitting}
      >
        {(formState) => (
          <Form.FieldStateProvider
            center
            validator={this.validator}
            formState={formState}
            textFieldProps={{
              margin: "dense",
              fullWidth: true,
            }}
          >
            {(fieldStates) => (
              <GridContainer spacing={16} justify="center">
                <ApiFormFields
                  fieldStates={fieldStates}
                  fields={method.form.fields}
                  GridProps={{
                    xs: 12,
                    sm: 6,
                  }}
                />
                <SubmitContainer
                  item
                  container
                  direction="column"
                  sm={12}
                  justify="center"
                >
                  {formError && (
                    <Typography
                      align="center"
                      color="error"
                      component="p"
                      variant="caption"
                    >
                      {formError}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!!formState.submitting}
                  >
                    {formState.submitting
                      ? "Processing..."
                      : methodType === "deposit"
                      ? "Deposit"
                      : "Withdraw"}
                  </Button>
                </SubmitContainer>
              </GridContainer>
            )}
          </Form.FieldStateProvider>
        )}
      </Form>
    );
  }

  handleSubmit = (data) => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit();
    }

    this.setState(
      {
        formError: undefined,
      },
      () => {
        try {
          data = processApiFields(this.props.method.form.fields, data);
        } catch (ex) {
          this.setState({
            formError: ex.message,
          });
          return;
        }

        const { method, methodType } = this.props;

        this.setState(
          {
            formError: undefined,
            submitting: true,
          },
          () => {
            apiFetch
              .post(
                `player/cashier/payment/${method.processor}/${method.code}/${
                  methodType === "deposit" ? "deposit" : "withdrawal"
                }`,
                { data }
              )
              .then(this.handleResponse)
              .catch((error) => this.handleResponse(error.response));
          }
        );
      }
    );
  };
  crypto_wallet;
  exchange_rate = undefined;

  handleResponse = (response) => {
    if (this._unmounted) {
      return;
    }

    this.setState({
      submitting: false,
    });

    if (
      !response ||
      !response.data ||
      !response.data.data ||
      !response.data.info
    ) {
      this.setState({
        formError:
          "We had a problem while processing your transfer. Please try again.",
      });
      return;
    }

    if (!response.data.info.success && response.data.data.messages) {
      this.setState({ formError: response.data.data.messages });
      return;
    }

    switch (response.data.data.status) {
      case "redirect":
        const { container, url, parameters, method, html } =
          response.data.data.redirect;
        let { height, width } = response.data.data.redirect;

        if (container === "iframe") {
          height = parseInt(height, 10);
          width = parseInt(width, 10);

          if (isNaN(height) || height < 600) {
            height = 600;
          }

          if (isNaN(width) || width < 600) {
            width = 600;
          }

          this.setState({
            iframeRedirect: {
              height,
              width,
              url,
              parameters,
              method,
            },
          });

          if (inBrowser) {
            window.resizeTo(width + 60, height + 150);
          }
        } else {
          if (url) {
            let urlParams = "";

            if (parameters) {
              for (const key of Object.keys(parameters)) {
                urlParams +=
                  encodeURIComponent(key) +
                  "=" +
                  encodeURIComponent(parameters[key]) +
                  "&";
              }
            }

            window.location.replace(url + "?" + urlParams);
          } else if (html) {
            document.open();
            document.write(html);
            document.close();
          }
        }
        break;

      case "show_wallet":
        let wallet = null;

        if (
          typeof response.data.data.crypto_wallet === "object" &&
          response.data.data.crypto_wallet.address &&
          typeof response.data.data.crypto_wallet.exchange_rate === "object"
        ) {
          const { currFromStr, currToStr } =
            response.data.data.crypto_wallet.exchange_rate;

          wallet = {
            message: `Current exchange rate: ${currFromStr} = ${currToStr}`,
            address: response.data.data.crypto_wallet.address,
            destinationTag: response.data.data.crypto_wallet.destinationTag,
          };
        }

        this.setState({ wallet });
        break;

      case "complete":
        window.close();
        break;

      default:
      // TODO sentry error, unknown payment method response
      console.log('Payment method unknown response', response);
    }
  };

  addressToClipboard = () => {
    const { wallet } = this.state;
    const { clipboard } = navigator;

    if (wallet && clipboard && clipboard.writeText) {
      const { address } = wallet;

      clipboard.writeText(address).then(() => {
        this.setState(
          {
            walletCopyTooltip: true,
          },
          () => {
            setTimeout(() => {
              this.setState({
                walletCopyTooltip: false,
              });
            }, 3000);
          }
        );
      });
    }
  };

  destinationTagToClipboard = () => {
    const { wallet } = this.state;
    const { clipboard } = navigator;

    if (wallet && clipboard && clipboard.writeText) {
      const { destinationTag } = wallet;

      clipboard.writeText(destinationTag).then(() => {
        this.setState(
          {
            walletCopyTagTooltip: true,
          },
          () => {
            setTimeout(() => {
              this.setState({
                walletCopyTagTooltip: false,
              });
            }, 3000);
          }
        );
      });
    }
  };

  handleTextFieldClick = () => {
    if (this.walletInputRef.current) {
      const { current: input } = this.walletInputRef;
      this.addressToClipboard();

      input.setSelectionRange(0, input.value.length);
    }
  };

  handleTagTextFieldClick = () => {
    if (this.walletTagInputRef.current) {
      const { current: input } = this.walletTagInputRef;
      this.destinationTagToClipboard();

      input.setSelectionRange(0, input.value.length);
    }
  };

  closeWindow = () => {
    window.close();
  };
}

const MainWrapper = styled.div`
	max-width: ${(p) => p.theme.spacing(100)}px;
	margin: 0 auto;
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: ${(p) => p.theme.spacing(2)}px;
	padding: 0 ${(p) => p.theme.spacing(1)}px;
	justify-content: center;

	& > p {
		padding: 0 0 0 ${(p) => p.theme.spacing(12)}px;
		position: relative;
		min-height: 50px;
	}

	& > p > img {
		left: 0;
		right: auto;
		top: 50%;
		position: absolute;
		width: 80px;
		height: 50px;
		transform: translateY(-50%);
	}
`;

const SubmitContainer = styled(Grid)`
	margin-top: ${(p) => p.theme.spacing(2)}px;

	& > p {
		margin-bottom: ${(p) => p.theme.spacing()}px;
	}
`;

const AddressField = styled(TextField)`
	max-width: 450px;

	.addressInput {
		font-size: ${(p) => p.theme.pxToRem(15)};
		text-align: center;
	}

	${(p) => p.theme.mui.breakpoints.down("xs")} {
		.addressInput {
			font-size: ${(p) => p.theme.pxToRem(12)};
		}
	}

	@media (max-width: 350px) {
		.addressInput {
			font-size: ${(p) => p.theme.pxToRem(10)};
		}
	}
`;

const WithAnchor = styled(Typography)`
	a, a:visited {
		color: #fff;
	}
`;

export default withRouter(PaymentForm);
