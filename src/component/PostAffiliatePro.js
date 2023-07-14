import React, { useEffect, useState } from "react";

import { subscribeTo, AppStateContainer } from "../state";
import { apiFetch } from "../util";

const defaultState = {
  campaign_id: null,
  click_tracker: null,
  click_tracker_url: null,
  impression_tracker: null,
  impression_tracker_url: null,
};

function PostAffiliatePro({ appState }) {
  const { aAid, aBid } = appState.state;

  const [papConfig, setPapConfig] = useState(defaultState);

  useEffect(() => {
    if (!aAid || !aBid) {
      return;
    }

    let trackingInitInterval;

    apiFetch("skinConfig/pap").then((response) => {
      const { data, info } = response.data;

      if (!info.success || !data.pap_affiliate) {
        return;
      }

      setPapConfig(data.pap_affiliate);

      const { click_tracker_url, click_tracker } = data.pap_affiliate;

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("id", "pap_x2s6df8d");
      script.src = `//${click_tracker_url}/scripts/${click_tracker}`;

      document.body.appendChild(script);

      trackingInitInterval = setInterval(() => {
        const { PostAffTracker } = window;

        if (!PostAffTracker) {
          return;
        }

        clearInterval(trackingInitInterval);

        PostAffTracker.setAccountId("default1");

        try {
          // eslint-disable-next-line
          var AffiliateID = aAid;
          // eslint-disable-next-line
          var BannerID = aBid;
          // eslint-disable-next-line
          var CampaignID = papConfig.campaign_id;

          PostAffTracker.track();
        } catch (ex) {}
      }, 250);
    });

    return () => {
      clearInterval(trackingInitInterval);
    };
  }, [aAid, aBid, papConfig.campaign_id]);

  if (!aAid || !aBid || !papConfig.campaign_id) {
    return null;
  }

  const { impression_tracker_url, impression_tracker, campaign_id } = papConfig;

  const imgUrl = `//${impression_tracker_url}/scripts/${impression_tracker}?a_aid=${aAid}&a_bid=${aBid}&a_cid=${campaign_id}`;

  return (
    <img style={{ border: "none" }} src={imgUrl} width="1" height="1" alt="" />
  );
}

export default subscribeTo(
  {
    appState: AppStateContainer,
  },
  PostAffiliatePro
);
