import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import { Contact, HowToPlay } from "./Help/";
import { ApiContentLoader } from "../component/api";
import { MaxWidth, VerticalPadder } from "../component/styled";
import { ScrollTopOnMount } from "../component";

const IndexRedirect = () => <Redirect to="/help/how-to-play" />;
const Faq = () => (
  <VerticalPadder>
    <ScrollTopOnMount />
    <MaxWidth>
      <ApiContentLoader
        type="faq"
        canonicalUrl="help/faq"
        setMeta
        showContentTitle
      />
    </MaxWidth>
  </VerticalPadder>
);
const PrivacyPolicy = () => (
  <VerticalPadder>
    <ScrollTopOnMount />
    <MaxWidth>
      <ApiContentLoader
        type="privacy_policy"
        canonicalUrl="help/privacy-policy"
        setMeta
        showContentTitle
      />
    </MaxWidth>
  </VerticalPadder>
);
const TermsAndConditions = () => (
  <VerticalPadder>
    <ScrollTopOnMount />
    <MaxWidth>
      <ApiContentLoader
        type="terms_and_conditions"
        canonicalUrl="help/terms-and-conditions"
        setMeta
        showContentTitle
      />
    </MaxWidth>
  </VerticalPadder>
);

function Help() {
  return (
    <Switch>
      <Route path="/help/how-to-play/:article?" component={HowToPlay} />
      <Route path="/help/contact" component={Contact} />
      <Route path="/help/faq" component={Faq} />
      <Route path="/help/privacy-policy" component={PrivacyPolicy} />
      <Route path="/help/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/help" component={IndexRedirect} />
    </Switch>
  );
}

export default Help;
