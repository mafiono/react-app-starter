import BaseModel from "./BaseModel";

class GameLogEntry extends BaseModel {
  static propertyMap = {
    id: "id",
    transactionId: "transid",
    balance: null,
    credit: null,
    debit: null,
    game: "gamename",
    roundId: "roundid",
    provider: "system",
    timeStamp: "time_stamp",
    detailsUrl: "url",
  };
}

export default GameLogEntry;
