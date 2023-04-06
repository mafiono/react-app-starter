import BaseModel from "./BaseModel";
import { BonusMeta } from ".";

class BonusHistory extends BaseModel {
  static getBonusMeta(data) {
    return new BonusMeta(data.bonus_data);
  }

  static getWagers(data) {
    const wagers = [];

    if (!!data.wagers) {
      for (const provider of Object.keys(data.wagers)) {
        const percentage = data.wagers[provider].percentage * 100;

        wagers.push({ provider, ...data.wagers[provider], percentage });
      }
    }

    return wagers;
  }

  static propertyMap = {
    id: null,
    bonusId: "bonus_id",
    bonusMeta: BonusHistory.getBonusMeta,
    active: null,
    bonusAmount: "bonus_amount",
    issuedOn: "issue_time",
    messageShown: "message_shown",
    playerMessage: "message_to_player",
    pointsNeeded: "points_needed",
    pointsCurrent: "points_current",
    validUntil: "valid_until",
    finishedOn: "finished_on",
    clearedPercentage: "bonus_cleared",
    contributionTotal: "contribution_total",
    depositAmount: "deposit_amount",
    wagers: BonusHistory.getWagers,
  };
}

export default BonusHistory;

export function processHistoryResponse(history) {
  let processedItems = [];

  for (const entryData of history) {
    processedItems.push(new BonusHistory(entryData));
  }

  return processedItems;
}
