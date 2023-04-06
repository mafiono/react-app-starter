import BaseModel from "./BaseModel";

class BonusMeta extends BaseModel {
  static propertyMap = {
    id: null,
    code: null,
    name: null,
    wageringRequirement: "wagering_requirement",
  };
}

export default BonusMeta;
