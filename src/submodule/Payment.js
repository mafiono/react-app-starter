import React from "react";
import Loadable from "react-loadable";

import { LoadingIndicator } from "../component";

export let PaymentModule;


const LoadableComponent = Loadable({
  loader: () => import("./payment"),
  loading: LoadingIndicator,
});

export default function Payment(props) {
  return <LoadableComponent {...props} />;
}
