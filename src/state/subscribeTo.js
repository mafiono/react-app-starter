import React from "react";
import { Subscribe } from "unstated";

export default function subscribeTo(targets, Component) {
  const keys = Object.keys(targets);
  const toProp = [];

  for (const key of keys) {
    toProp.push(targets[key]);
  }

  let renderIndex = 0;

  return class SubscribedComponent extends React.Component {
    render() {
      return <Subscribe to={toProp}>{this.renderProp}</Subscribe>;
    }

    renderProp = (...args) => {
      const stateProps = {};

      let i = 0;
      for (const key of keys) {
        stateProps[key] = args[i];
        i++;
      }

      return (
        <Component
          {...stateProps}
          {...this.props}
          _renderIndex={renderIndex++}
        />
      );
    };
  };
}
